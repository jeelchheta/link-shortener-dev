import 'dotenv/config';
import express, {} from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import router from "./routes/index.js";
import { redirectToOriginal } from './controllers/linkController.js';
import path from 'path';
import { fileURLToPath } from "url";
const app = express();
const PORT = process.env.PORT || 5000;
// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// React build path
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.urlencoded({
    extended: false,
}));
app.set("trust proxy", 1);
// Middleware to parse JSON payloads
app.use(express.json());
// route
app.use("/r/:code", redirectToOriginal);
app.use("/api/", router);
// ---------------- REACT FRONTEND ----------------
// Serve React static files
app.use(express.static(buildPath));
// React Router fallback
app.get("/{*splat}", (req, res, next) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err)
            next();
    });
});
// ---------------- ERROR HANDLER ----------------
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
export default app;
//# sourceMappingURL=index.js.map