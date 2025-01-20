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
import bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, firstname, lastname, password: hashedPassword, isStudent, email, phoneNumber: 0, class: "" });
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

    const isMatch = await bcrypt.compare(password, account.password);

    if (!account || !isMatch) {
      return res.status(401).json({
        message: "Invalid username or password!",
        success: false,
      });
    }

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
      return res.status(404).json({
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
    }

    let filteredTeachers = [];
    for (let teacher of teachers) {
      const acceptedRequestCount = await Request.countDocuments({
        teacher: teacher._id,
        status: "accepted",
      })

      if (acceptedRequestCount < 5) {
        filteredTeachers.push(teacher);
      }
    }

    return res.status(200).json({
      filteredTeachers,
    });

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

    const ifRequestExists = await Request.countDocuments({ student, teacher });
    if (ifRequestExists > 0) {
      return res.status(400).json({
        message: "Request already exists!",
      });
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
  const { id } = req.auth;

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
    console.log(requests);

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

    if (request.status === "accepted") {
      return res.status(400).json({
        message: "Student has already an accepted application!",
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
  } catch (error) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/accepted-requests-count", async (req, res) => {
  const { id } = req.auth;

  try {
    const teacherRequests = await Request.countDocuments({ teacher: id, status: "accepted" });

    return res.status(200).json({
      acceptedRequests: teacherRequests,
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/sent-requests", async (req, res) => {
  const { id } = req.auth;

  try {
    const sentRequests = await Request.find({ student: id })
      .populate("teacher", "firstname lastname");

    return res.status(200).json({
      sentRequests: sentRequests.length > 0 ? sentRequests : [],
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.post("/send-final-application", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { student, teacher } = req.body;

  try {
    const request = await Request.findOne({ student, teacher });

    if (!request) {
      return res.status(404).json({
        message: "Request not found!"
      });
    }

    let filePath = path.normalize(file.path);
    filePath = filePath.replace(/\\/g, "/");

    request.fileUrl = filePath;
    if (request.status === "rejected") {
      request.status = "approved";
    }
    await request.save();

    return res.status(200).json({
      message: "Application sent successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/final-applications", async (req, res) => {
  const { id } = req.auth;

  try {
    const requests = await Request.find({ teacher: id }).populate("student", "firstname lastname");

    if (!requests) {
      return res.status(404).json({
        message: "Requests not found!",
      })
    }

    const filteredRequests = requests.filter((request) => request.fileUrl !== "" && request.status === "approved");

    return res.status(200).json({
      filteredRequests,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

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

app.post("/reject-final-application", async (req, res) => {
  const { status, id, student } = req.body;

  try {
    const request = await Request.findOne({ _id: id, student, status: "approved" });

    request.status = status;
    await request.save();
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    });
  }
});

app.post("/accept-final-application", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { id, student, status } = req.body;

  try {
    const checkAcceptedRequest = await Request.findOne({ student, status: "accepted" });

    if (checkAcceptedRequest) {
      return res.status(409).json({
        message: "Someone has already accepted this application!",
      });
    }

    const request = await Request.findOne({ _id: id, student });

    if (!request) {
      return res.status(404).json({
        message: "Request not found!",
      })
    }

    request.status = status;

    let filePath = path.normalize(file.path);
    filePath = filePath.replace(/\\/g, "/");

    request.fileUrl = filePath;
    await request.save();
    return res.status(200).json({
      message: "Application accepted!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    })
  }
});

app.get("/accepted-application", async (req, res) => {
  const { id } = req.auth;

  try {
    let request = await Request.findOne({ student: id, status: "accepted" }).populate("teacher", "firstname lastname");

    if (!request) {
      return res.status(404).json({
        message: "Requests not found!",
      })
    }

    return res.status(200).json({
      request,
    });

  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    })
  }
});

app.get("/accepted-applications", async (req, res) => {
  const { id } = req.auth;


  try {
    let request = await Request.find({ teacher: id, status: "accepted" }).populate("student", "firstname lastname");

    if (request.length === 0) {
      return res.status(404).json({
        message: "Requests not found!",
      })
    }

    return res.status(200).json({
      request,
    });

  } catch (err) {
    return res.status(500).json({
      message: "An error occured when you sent the request. Please try again later!",
    })
  }
});


app.listen(PORT, () => {
  console.log(`has started on port ${PORT}!`);
});
