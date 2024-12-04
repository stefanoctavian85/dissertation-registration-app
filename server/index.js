import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { expressjwt } from "express-jwt";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import mongoose from 'mongoose';
import { User } from './db/Account.model.js';
import jwt from 'jsonwebtoken'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database successfully!");
  } catch(err) {
    console.error("Error connecting to database: " + err);
  }
}

connectToDatabase();

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

app.use(expressjwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
}).unless({
  path: ['/login', '/api-doc', '/api-doc.yml']
}));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const account = await User.findOne({ username });

    if (!account) {
      return res.status(400).json({
        message: "Invalid username or password!",
        success: false,
      });
    }

    if (username === account.username && password === account.password) {
      const token = jwt.sign(
        { username: account.username },
        process.env.SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful!",
        success: true,
        token,
      });
    }
  } catch (err) {
      console.error("Error during login: " + err);
      return res.status(500).json({
        message: "Server error!",
        success: false,
      });
  }
});

app.get('/profile', async (req, res) => {
  const { username } = req.auth;

  const account = await User.findOne({ username });

  if (!account) {
    res.status(400).json({
      message: "The user does not exist!",
    });
  }

  res.status(200).json({
    username: account.username,
    phoneNumber: account.phoneNumber,
  });
})

app.listen(PORT, () => {
  console.log(`has started on port ${PORT}!`);
});
