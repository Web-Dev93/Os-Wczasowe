import { Readable } from 'stream';
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from '@workspace/api-zod';
import express, { Router, type IRouter, type Request, type Response } from 'express';

import {
  ObjectNotFoundError,
  ObjectPermission,
  ObjectStorageService,
} from '../lib/objectStorage';
import { requireAdmin } from '../middlewares/auth';

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * PUT /storage/local-uploads/:id
 *
 * Receives the raw file bytes for an upload URL minted by request-url below.
 * This stands in for the direct-to-bucket PUT that a real presigned URL
 * would normally target — self-hosted storage has no external bucket, so
 * the upload lands on this server instead.
 */
router.put(
  '/storage/local-uploads/:id',
  requireAdmin,
  express.raw({ type: '*/*', limit: '25mb' }),
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || /[/.]/.test(id)) {
      res.status(400).json({ error: 'Invalid upload id' });
      return;
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      res.status(400).json({ error: 'Empty request body' });
      return;
    }
    try {
      await objectStorageService.writeUpload(id, req.body, {
        contentType:
          (Array.isArray(req.headers['content-type'])
            ? req.headers['content-type'][0]
            : req.headers['content-type']) || 'application/octet-stream',
      });
      res.status(200).end();
    } catch (error) {
      req.log.error({ err: error }, 'Error writing local upload');
      res.status(500).json({ error: 'Failed to store upload' });
    }
  },
);

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to the returned presigned URL.
 * Requires auth middleware so public callers cannot mint write-capable URLs.
 */
router.post(
  '/storage/uploads/request-url',
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = RequestUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Missing or invalid required fields' });
      return;
    }

    try {
      const { name, size, contentType } = parsed.data;

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath =
        objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json(
        RequestUploadUrlResponse.parse({
          uploadURL,
          objectPath,
          metadata: { name, size, contentType },
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, 'Error generating upload URL');
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  },
);

/**
 * POST /storage/uploads/finalize
 *
 * Admin-only: mark an uploaded object as a public site asset (logo/favicon).
 * Objects without a public ACL policy are not served to visitors.
 */
router.post(
  '/storage/uploads/finalize',
  requireAdmin,
  async (req: Request, res: Response) => {
    const { objectPath } = (req.body ?? {}) as { objectPath?: string };
    if (typeof objectPath !== 'string' || !objectPath.startsWith('/objects/')) {
      res.status(400).json({ error: 'Invalid objectPath' });
      return;
    }
    try {
      const normalized = await objectStorageService.trySetObjectEntityAclPolicy(
        objectPath,
        { owner: 'admin', visibility: 'public' },
      );
      res.json({ objectPath: normalized });
    } catch (error) {
      req.log.error({ err: error }, 'Error finalizing upload');
      res.status(500).json({ error: 'Failed to finalize upload' });
    }
  },
);

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 * IMPORTANT: Always provide this endpoint when object storage is set up.
 */
router.get(
  '/storage/public-objects/*filePath',
  async (req: Request, res: Response) => {
    try {
      const raw = req.params.filePath;
      const filePath = Array.isArray(raw) ? raw.join('/') : raw;
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const response = await objectStorageService.downloadObject(file);

      res.status(response.status);
      response.headers.forEach((value, key) => res.setHeader(key, value));

      if (response.body) {
        const nodeStream = Readable.fromWeb(
          response.body as ReadableStream<Uint8Array>,
        );
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      req.log.error({ err: error }, 'Error serving public object');
      res.status(500).json({ error: 'Failed to serve public object' });
    }
  },
);

/**
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR.
 * These are served from a separate path from /public-objects and can optionally
 * be protected with authentication or ACL checks based on the use case.
 */
router.get('/storage/objects/*path', async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join('/') : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile =
      await objectStorageService.getObjectEntityFile(objectPath);

    // Public-visibility objects (finalized site assets) are served to anyone;
    // everything else requires an admin session.
    const sess = req.session as { isAdmin?: boolean } | undefined;
    const canAccess = await objectStorageService.canAccessObjectEntity({
      userId: sess?.isAdmin ? 'admin' : undefined,
      objectFile,
      requestedPermission: ObjectPermission.READ,
    });
    if (!canAccess) {
      res.status(404).json({ error: 'Object not found' });
      return;
    }

    const response = await objectStorageService.downloadObject(objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(
        response.body as ReadableStream<Uint8Array>,
      );
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, 'Object not found');
      res.status(404).json({ error: 'Object not found' });
      return;
    }
    req.log.error({ err: error }, 'Error serving object');
    res.status(500).json({ error: 'Failed to serve object' });
  }
});

export default router;
