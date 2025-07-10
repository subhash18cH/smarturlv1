import express from "express";
import authRoutes from "../src/routes/user";
import dotenv from "dotenv";
import { connectToDB } from "./db/db";

dotenv.config();

const app = express();

connectToDB();

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log(`server running on ${PORT}`)
)