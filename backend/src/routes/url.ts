import express from "express";
import { getUrlStats, getLongUrl, getUserUrls, shortUrl, getDeviceStats, deleteURL, getDailyClicks } from "../controllers/url";
import { validateToken } from "../middlewares/validateToken";

const router = express.Router();

router.post("/short-url", validateToken, shortUrl);
router.get("/user", validateToken, getUserUrls);
router.get("/total-stats", validateToken, getUrlStats);
router.get("/device-stats", validateToken, getDeviceStats)
router.delete("/delete-url", validateToken, deleteURL)
router.get("/daily-clicks", validateToken, getDailyClicks)
router.get("/:shortUrl", getLongUrl);

export default router;