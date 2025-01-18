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
import { Request } from "./db/Request.model.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = Date.now() + fileExtension;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
});

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database successfully!");
  } catch (err) {
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
  path: ['/login', '/api-doc', '/api-doc.yml', '/register', '/download']
}));

app.post("/register", async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  const isStudent = true;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const newUser = new User({ username, firstname, lastname, password, isStudent, email, phoneNumber: 0, class: "" });
    await newUser.save();
    return res.status(201).json({ message: "Register was successful!" });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

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
        { username: account.username, id: account._id.toString() },
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
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
      success: false,
    });
  }
});

app.get('/profile', async (req, res) => {
  const { username } = req.auth;

  try {
    const account = await User.findOne({ username });

    if (!account) {
      return res.status(400).json({
        message: "The user does not exist!",
      });
    }

    res.status(200).json({
      username: account.username,
      phoneNumber: account.phoneNumber,
      firstname: account.firstname,
      lastname: account.lastname,
      isStudent: account.isStudent,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({
      isStudent: false,
    });

    if (teachers.length === 0) {
      return res.status(404).json({
        message: "No teachers found",
      });
    } else {
      return res.status(200).json(teachers);
    }
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.post("/submit-request", async (req, res) => {
  const { teacherId, studentId } = req.body;

  try {
    const student = await User.findById(studentId);
    const teacher = await User.findById(teacherId);

    if (!student || !teacher) {
      return res.status(404).json({
        message: "Student or teacher not found!"
      });
    }

    const ifRequestExists = await Request.find({student, teacher});
    if (ifRequestExists.length !== 0) {
      return res.status(404).json({
        message: "Request already exists!",
      })
    }

    const newRequest = new Request({
      student: studentId,
      teacher: teacherId,
      status: "pending",
    });

    await newRequest.save();

    return res.status(201).json({
      message: `Request successfully sent to ${teacher.firstname + " " + teacher.lastname}`,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/requests", async (req, res) => {
  const { id, username } = req.auth;

  try {
    const teacher = await User.findById(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found!",
      })
    }

    const requests = await Request.find({
      teacher: id,
    }).populate("student", "firstname lastname");

    if (requests.length === 0) {
      return res.status(404).json({
        message: "Requests not found!",
      })
    }

    return res.status(200).json({
      requests,
    });

  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.post("/change-request-status", async (req, res) => {
  const { requestId, status, message } = req.body;

  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found!",
      })
    }
    
    request.status = status;

    if (status === "rejected") {
      request.message = message;
    }

    await request.save();

    return res.status(200).json({
      message: "Request update successfully!",
    })
  } catch(error) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/approved-requests-count", async (req, res) => {
  const { id } = req.auth;

  try {
    const teacherRequests = await Request.countDocuments({teacher: id, status: "approved"});

    if (!teacherRequests) {
      return res.status(404).json({
        message: "Approved requests not found",
      });
    }

    return res.status(200).json({
      approvedRequests: teacherRequests,
    });

  } catch(error) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/sent-requests", async (req, res) => {
  const { id } = req.auth;

  try {
    const sentRequests = await Request.find({student: id})
    .populate("teacher", "firstname lastname");

    if (sentRequests.length === 0) {
      return res.status(404).json({
        message: "You didn't send any request yet!",
      });
    }

    return res.status(200).json({
      sentRequests,
    });
  } catch(err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.post("/send-final-application", upload.single("file"), async (req, res) => {
  const file = req.file;
  const {student, teacher} = req.body;
  const fileExtension = path.extname(file.originalname);

  try {
    const request = await Request.findOne({student, teacher});

    if (!request) {
      return res.status(404).json({
        message: "Request not found!"
      });
    }

    let filePath = path.normalize(file.path);
    filePath = filePath.replace(/\\/g, "/");

    request.fileUrl = filePath;
    await request.save();

    return res.status(200).json({
      message: "Application sent successfully!",
    });
  } catch(err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/final-applications", async (req, res) => {
  const { id } = req.auth;

  try {
    const requests = await Request.find({teacher: id}).populate("student", "firstname lastname");

    if (!requests) {
      return res.status(404).json({
        message: "Requests not found!",
      })
    }

    const filteredRequests = requests.filter((request) => request.fileUrl && request.fileUrl.length > 0);

    return res.status(200).json({
      filteredRequests,
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  console.log(filePath);

  res.download(filePath, (error) => {
    if (error) {
      console.error(error);
    }
  });
});

app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "uploads", "Model_cerere.pdf");

  res.download(filePath, (error) => {
    if (error) {
      console.error(error);
    }
  })
});

app.listen(PORT, () => {
  console.log(`has started on port ${PORT}!`);
});
