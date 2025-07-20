import express from "express";
import authRoutes from "../src/routes/user";
import urlRoutes from "../src/routes/url";
import qrCodeRoutes from "../src/routes/qr";
import dotenv from "dotenv";
import { connectToDB } from "./db/db";
import useragent from "express-useragent";
import cors from "cors"
dotenv.config();

const app = express();

connectToDB();

const PORT = process.env.PORT;
const Frontend_url = process.env.FRONTEND_URL
//middleware
app.use(express.json());
app.use(useragent.express())
app.use(cors({
  origin: Frontend_url,
  credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/qrcode", qrCodeRoutes)

app.listen(3000, () => console.log(`server running on ${PORT}`)
)