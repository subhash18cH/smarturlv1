"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_1 = require("../controllers/url");
const validateToken_1 = require("../middlewares/validateToken");
const router = express_1.default.Router();
router.post("/short-url", validateToken_1.validateToken, url_1.shortUrl);
router.get("/user", validateToken_1.validateToken, url_1.getUserUrls);
router.get("/total-stats", validateToken_1.validateToken, url_1.getUrlStats);
router.get("/device-stats", validateToken_1.validateToken, url_1.getDeviceStats);
router.delete("/delete-url", validateToken_1.validateToken, url_1.deleteURL);
router.get("/daily-clicks", validateToken_1.validateToken, url_1.getDailyClicks);
router.get("/:shortUrl", url_1.getLongUrl);
exports.default = router;
