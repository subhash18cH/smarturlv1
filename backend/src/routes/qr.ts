import express from "express";
import { deleteQR, generateQR, getQR } from "../controllers/url";
import { validateToken } from "../middlewares/validateToken";

const router = express.Router();

router.post("/generate", validateToken, generateQR);
router.get("/retrieve", validateToken, getQR);
router.delete("/delete-qr", validateToken, deleteQR)

export default router;