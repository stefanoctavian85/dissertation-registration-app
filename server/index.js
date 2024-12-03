import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { expressjwt } from "express-jwt";
import { getAccountByUsername, getAccountById, migrate } from "./db/service.js";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
//test
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

migrate();

app.use("/api-doc.yml", express.static(path.join(__dirname, "api-doc.yml")));

app.use(
  "/api-doc",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: { url: `http://localhost:${PORT}/api-doc.yml` },
  })
);

app.get("/api-doc.yml", (req, res) => {
  res.json(app.apiDoc);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const account = await getAccountByUsername(req.body.username);

  if (!account) {
    return res.status(400).json({ message: "Invalid username or password!" });
  }

  if (username === account.username && password === account.password) {
    return res.status(200).json({ message: "Login successful!" });
  }

  return res.status(400).json({ message: "Invalid username or password!" });
});

app.listen(PORT, () => {
  console.log(`has started on port ${PORT}!`);
});
