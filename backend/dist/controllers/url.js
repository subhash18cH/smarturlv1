"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQR = exports.getQR = exports.generateQR = exports.getDeviceStats = exports.getUrlStats = exports.getDailyClicks = exports.deleteURL = exports.getLongUrl = exports.getUserUrls = exports.shortUrl = void 0;
const url_1 = require("../models/url");
const user_1 = require("../models/user");
const nanoid_1 = require("nanoid");
const qrcode_1 = __importDefault(require("qrcode"));
const mongoose_1 = __importDefault(require("mongoose"));
//POST - /api/url/short-url - for shortening a long url
const shortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { longUrl } = req.body;
        if (!longUrl) {
            res.status(400).json({ message: "LongUrl is required" });
            return;
        }
        try {
            new URL(longUrl);
        }
        catch (err) {
            res.status(400).json({ message: "Invalid URL format." });
            return;
        }
        const existing_url = yield url_1.Url.findOne({ ownerUserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, originalURL: longUrl });
        if (existing_url) {
            res.status(200).json(existing_url.shortURL);
            return;
        }
        const url = yield url_1.Url.create({
            originalURL: longUrl,
            shortURL: (0, nanoid_1.nanoid)(6),
            ownerUserId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId
        });
        res.status(200).json(url);
    }
    catch (error) {
        res.status(500).json({ message: "Error in shortening URl" });
    }
});
exports.shortUrl = shortUrl;
//GET - /api/url/user - for getting user urls
const getUserUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const user = user_1.User.findById(user_id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const urls = yield url_1.Url.find({ ownerUserId: user_id });
        res.status(200).json(urls);
    }
    catch (error) {
        res.status(500).json({ message: "Error in shortening URl" });
    }
});
exports.getUserUrls = getUserUrls;
//GET - /api/url/{shortUrl} - for getting long url related to short url
const getLongUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortUrl } = req.params;
        // Find the URL document
        const url = yield url_1.Url.findOne({ shortURL: shortUrl });
        if (!url) {
            res.status(404).json({ message: "URL not found" });
            return;
        }
        // Determine device type from user agent
        const source = req.useragent;
        let deviceType = 'Desktop';
        if (source === null || source === void 0 ? void 0 : source.isMobile) {
            deviceType = 'Mobile';
        }
        else if (source === null || source === void 0 ? void 0 : source.isTablet) {
            deviceType = 'Tablet';
        }
        url.click_count = (url.click_count || 0) + 1;
        if (!url.deviceClicks) {
            url.deviceClicks = {};
        }
        url.deviceClicks[deviceType] = (url.deviceClicks[deviceType] || 0) + 1;
        yield url.save();
        res.redirect(url.originalURL);
    }
    catch (error) {
        console.error('Error retrieving URL:', error);
        res.status(500).json({ message: "Error retrieving URL" });
    }
});
exports.getLongUrl = getLongUrl;
//DELETE - /api/url/delete-url - for deleting qr code
const deleteURL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortUrl } = req.body;
        if (!shortUrl) {
            res.status(400).json({ message: "shortUrl is required" });
            return;
        }
        const url = yield url_1.Url.findOne({ shortURL: shortUrl });
        if (!url) {
            res.status(404).json({ message: "URL not found" });
            return;
        }
        yield url.deleteOne();
        res.status(200).json({ message: "URL deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting QR code", error });
    }
});
exports.deleteURL = deleteURL;
// GET - /api/url/daily-clicks - returns daily clicks for the logged-in user
const getDailyClicks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            return;
        }
        const data = yield url_1.Url.aggregate([
            {
                $match: {
                    ownerUserId: new mongoose_1.default.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
                    },
                    clickCount: { $sum: "$click_count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    clickCount: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        console.error('Error in getDailyClicks:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getDailyClicks = getDailyClicks;
//GET - /api/url/total-stats - for getting long url related to short url
const getUrlStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const userUrls = yield url_1.Url.find({ ownerUserId: userId });
        const total_urls = userUrls.length;
        const total_clicks = userUrls.reduce((sum, url) => sum + (url.click_count || 0), 0);
        res.status(200).json({
            total_urls,
            total_clicks,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error in getting URl stats" });
    }
});
exports.getUrlStats = getUrlStats;
//GET - /api/url/device-stats - for getting device stats related to short url
const getDeviceStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const userUrls = yield url_1.Url.find({ ownerUserId: userId });
        const deviceClicksArray = userUrls.map(url => ({
            deviceClicks: url.deviceClicks,
        }));
        const total_links = userUrls.length;
        const total_clicks = userUrls.reduce((sum, url) => sum + (url.click_count || 0), 0);
        res.status(200).json({ deviceClicksArray, total_clicks, total_links });
    }
    catch (error) {
        res.status(500).json({ message: "Error in getting URl stats" });
    }
});
exports.getDeviceStats = getDeviceStats;
//POST - /api/qrcode/generate - for generating qr code
const generateQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { longUrl } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!longUrl) {
            res.status(400).json({ message: "Long URL is required" });
            return;
        }
        try {
            new URL(longUrl);
        }
        catch (err) {
            res.status(400).json({ message: "Invalid URL format." });
            return;
        }
        const existingUrl = yield url_1.Url.findOne({ originalURL: longUrl, ownerUserId: userId });
        if (existingUrl) {
            const qrCodeBase64 = yield qrcode_1.default.toDataURL(existingUrl.shortURL);
            existingUrl.qrCode = qrCodeBase64;
            yield existingUrl.save();
            res.status(200).json(existingUrl);
            return;
        }
        const shortCode = (0, nanoid_1.nanoid)(6);
        const qrCodeBase64 = yield qrcode_1.default.toDataURL(shortCode);
        const newUrl = yield url_1.Url.create({
            originalURL: longUrl,
            shortURL: shortCode,
            ownerUserId: userId,
            qrCode: qrCodeBase64,
        });
        res.status(200).json(newUrl);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateQR = generateQR;
//GET - /api/qrcode/retrieve - for retrieving qr code
const getQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const urls = yield url_1.Url.find({ ownerUserId: userId, qrCode: { $exists: true, $ne: null, $nin: [""] } });
        const qrCodes = urls.map(url => ({
            originalURL: url.originalURL,
            shortURL: url.shortURL,
            qrCode: url.qrCode,
        }));
        res.status(200).json(qrCodes);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQR = getQR;
//DELETE - /api/qrcode/delete-qr - for deleting qr code
const deleteQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortUrl } = req.body;
        if (!shortUrl) {
            res.status(400).json({ message: "shortUrl is required" });
            return;
        }
        const url = yield url_1.Url.findOne({ shortURL: shortUrl });
        if (!url) {
            res.status(404).json({ message: "URL not found" });
            return;
        }
        url.qrCode = undefined;
        yield url.save();
        res.status(200).json({ message: "QR Code deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting QR code", error });
    }
});
exports.deleteQR = deleteQR;
