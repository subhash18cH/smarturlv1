import express from "express";
import { getUrlStats, getLongUrl, getUserUrls, shortUrl, getDeviceStats } from "../controllers/url";
import { validateToken } from "../middlewares/validateToken";

const router = express.Router();

router.post("/short-url", validateToken, shortUrl);
router.post("/user", validateToken, getUserUrls);
router.get("/total-stats", validateToken, getUrlStats);
router.get("/device-stats", validateToken, getDeviceStats)
router.get("/:shortUrl", getLongUrl);

export default router;