import { Router, type IRouter } from "express";
import healthRouter from "./health";
import settingsRouter from "./settings";
import authRouter from "./auth";
import roomsRouter from "./rooms";
import galleryRouter from "./gallery";
import bookingsRouter from "./bookings";
import availabilityRouter from "./availability";
import statsRouter from "./stats";
import icalRouter from "./ical";
import postsRouter from "./posts";
import landingContactRouter from "./landing-contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(settingsRouter);
router.use(roomsRouter);
router.use(galleryRouter);
router.use(bookingsRouter);
router.use(availabilityRouter);
router.use(statsRouter);
router.use(icalRouter);
router.use(postsRouter);
router.use(landingContactRouter);

export default router;
