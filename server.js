import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import "dotenv/config";

const app = express();

const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:5173", process.env.FRONTEND_URL],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});