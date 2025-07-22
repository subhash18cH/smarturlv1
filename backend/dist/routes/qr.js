"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_1 = require("../controllers/url");
const validateToken_1 = require("../middlewares/validateToken");
const router = express_1.default.Router();
router.post("/generate", validateToken_1.validateToken, url_1.generateQR);
router.get("/retrieve", validateToken_1.validateToken, url_1.getQR);
router.delete("/delete-qr", validateToken_1.validateToken, url_1.deleteQR);
exports.default = router;
