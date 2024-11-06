import { Router } from "express";
import multer from "multer";
import {
  getAllStudents,
  getStudentbyId,
  getAllClubs,
  createClub,
  getClubbyId,
  requestToJoinClub,
  createPost,
  getAllProfessors,
  updateClubDescription
} from "../controllers/club.js";

import { getAllPosts } from "../controllers/post.js";
import { getAllAnnouncements, createAnnouncement } from "../controllers/announcement.js";
import { getAllBuildings } from "../controllers/building.js";
import { clubLocation } from "../controllers/clubLocation.js";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }); //Configure multer storage

const router = Router();

router.get("/students", getAllStudents);
router.get("/students/:id", getStudentbyId);
router.get("/professors", getAllProfessors);
router.get("/buildings", getAllBuildings);

router.get("/posts", getAllPosts); // More specific path
router.get("/announcements", getAllAnnouncements); // More specific path
router.post("/announcements", createAnnouncement); // Route to create an announcement

router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post("/:clubId/join-request", requestToJoinClub);
router.get("/clubLocation/:buildingId", clubLocation); // Path to get clubs by building ID

router.post("/create", upload.single("club_img"), createClub);
router.post("/admin/post", upload.single("photo"), createPost);

router.get("/", getAllClubs);

export { router as clubRouter };