import { Router } from "express";
// import your logics from controllers here
import {
  getAllStudents,
  getStudentbyId,
  getAllClubs,
  createClub,
  getClubbyId,
  requestToJoinClub,
  createPost,
} from "../controllers/club.js"; // Import the controller

import { getAllPosts } from "../controllers/post.js"; // Import the controller
import { getAllAnnouncements, createAnnouncement } from "../controllers/announcement.js";

import multer from "multer";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }); // Configure multer storage

const router = Router();

router.get("/students", getAllStudents);
router.get("/students/:id", getStudentbyId);

router.get("/posts", getAllPosts); // More specific path
router.get("/announcements", getAllAnnouncements); // More specific path
router.post("/announcements", createAnnouncement); // Route to create an announcement

router.get("/", getAllClubs);       // General path for all clubs
router.get("/:id", getClubbyId);    // ID-specific path for clubs

router.post("/clubs/:clubId/request", requestToJoinClub);
router.post("/create", upload.single("club_img"), createClub);
router.post("/admin/post", upload.single("photo"), createPost);

export { router as clubRouter };
