"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../src/routes/user"));
const url_1 = __importDefault(require("../src/routes/url"));
const qr_1 = __importDefault(require("../src/routes/qr"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const express_useragent_1 = __importDefault(require("express-useragent"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.connectToDB)();
const PORT = process.env.PORT;
const Frontend_url = process.env.FRONTEND_URL;
//middleware
app.use(express_1.default.json());
app.use(express_useragent_1.default.express());
app.use((0, cors_1.default)({
    origin: Frontend_url,
    credentials: true
}));
app.use("/api/auth", user_1.default);
app.use("/api/url", url_1.default);
app.use("/api/qrcode", qr_1.default);
app.listen(3000, () => console.log(`server running on ${PORT}`));
