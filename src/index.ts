import dotenv from "dotenv";
dotenv.config();

import express from "express";
import videoRoutes from "./routes/videoRoute";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(errorHandler);

app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
