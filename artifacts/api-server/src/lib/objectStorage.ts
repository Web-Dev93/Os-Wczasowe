import { randomUUID } from 'crypto';
import { promises as fs, createReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';

export enum ObjectPermission {
  READ = 'read',
  WRITE = 'write',
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super('Object not found');
    this.name = 'ObjectNotFoundError';
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

interface ObjectMeta {
  contentType: string;
  size: number;
  originalName: string;
  owner: string;
  visibility: 'public' | 'private';
}

export interface LocalObjectFile {
  id: string;
  dataPath: string;
  metaPath: string;
}

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'uploads');

function objectFile(id: string): LocalObjectFile {
  return {
    id,
    dataPath: path.join(STORAGE_DIR, id),
    metaPath: path.join(STORAGE_DIR, `${id}.meta.json`),
  };
}

async function readMeta(file: LocalObjectFile): Promise<ObjectMeta | null> {
  try {
    const raw = await fs.readFile(file.metaPath, 'utf-8');
    return JSON.parse(raw) as ObjectMeta;
  } catch {
    return null;
  }
}

/**
 * Self-hosted replacement for Replit's Object Storage (GCS via sidecar auth,
 * which only works on Replit). Files live on local disk under STORAGE_DIR —
 * mount that as a persistent Docker volume in production.
 */
export class ObjectStorageService {
  async ensureStorageDir(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }

  /** Returns the URL the client should PUT the raw file bytes to. */
  async getObjectEntityUploadURL(): Promise<string> {
    await this.ensureStorageDir();
    const id = randomUUID();
    return `/api/storage/local-uploads/${id}`;
  }

  /** Writes an in-progress upload's bytes + metadata to disk. */
  async writeUpload(
    id: string,
    data: Buffer,
    meta: { contentType: string; originalName?: string },
  ): Promise<void> {
    await this.ensureStorageDir();
    const file = objectFile(id);
    await fs.writeFile(file.dataPath, data);
    const record: ObjectMeta = {
      contentType: meta.contentType || 'application/octet-stream',
      size: data.byteLength,
      originalName: meta.originalName || id,
      owner: 'admin',
      visibility: 'private',
    };
    await fs.writeFile(file.metaPath, JSON.stringify(record));
  }

  normalizeObjectEntityPath(rawPath: string): string {
    const match = rawPath.match(/\/api\/storage\/local-uploads\/([^/?]+)/);
    if (match) {
      return `/objects/${match[1]}`;
    }
    return rawPath;
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalObjectFile> {
    if (!objectPath.startsWith('/objects/')) {
      throw new ObjectNotFoundError();
    }
    const id = objectPath.slice('/objects/'.length);
    if (!id || id.includes('/') || id.includes('..')) {
      throw new ObjectNotFoundError();
    }
    const file = objectFile(id);
    const meta = await readMeta(file);
    if (!meta) {
      throw new ObjectNotFoundError();
    }
    return file;
  }

  async downloadObject(file: LocalObjectFile, cacheTtlSec = 3600): Promise<Response> {
    const meta = await readMeta(file);
    if (!meta) {
      throw new ObjectNotFoundError();
    }

    const nodeStream = createReadStream(file.dataPath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      'Content-Type': meta.contentType,
      'Content-Length': String(meta.size),
      'Cache-Control': `${meta.visibility === 'public' ? 'public' : 'private'}, max-age=${cacheTtlSec}`,
    };

    return new Response(webStream, { headers });
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: { owner: string; visibility: 'public' | 'private' },
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith('/objects/')) {
      return normalizedPath;
    }
    const file = await this.getObjectEntityFile(normalizedPath);
    const meta = await readMeta(file);
    if (!meta) {
      throw new ObjectNotFoundError();
    }
    meta.owner = aclPolicy.owner;
    meta.visibility = aclPolicy.visibility;
    await fs.writeFile(file.metaPath, JSON.stringify(meta));
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile: file,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: LocalObjectFile;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    const meta = await readMeta(file);
    if (!meta) return false;

    const permission = requestedPermission ?? ObjectPermission.READ;

    if (meta.visibility === 'public' && permission === ObjectPermission.READ) {
      return true;
    }

    return !!userId && meta.owner === userId;
  }

  // Unused in the self-hosted setup (no pre-populated public asset bucket),
  // kept so routes/storage.ts's /public-objects endpoint still resolves.
  async searchPublicObject(_filePath: string): Promise<null> {
    return null;
  }
}
