import { Router } from "express";
import multer from "multer";
import {
  getAllStudents,
  getStudentbyId,
  getAllClubs,
  createClub,
  getClubbyId,
  getAllProfessors,
  updateClubDescription,
} from "../controllers/club.js";

import { getAllPosts, getPostByClubId, createPost } from "../controllers/post.js";
import { getAllAnnouncements, createAnnouncement, getAnnouncementsByClubId } from "../controllers/announcement.js";
import { getAllBuildings } from "../controllers/building.js";
import { clubLocation } from "../controllers/clubLocation.js";
import { getMemberByClubId } from "../controllers/clubMember.js";
import { getNotifications } from "../controllers/clubNotifications.js";
import { requestToJoinClub, getPendingRequests, updateJoinRequestStatus } from "../controllers/request.js";

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
router.get("/posts/:clubId", getPostByClubId);
router.get("/announcements", getAllAnnouncements); // More specific path
router.get("/announcements/:clubId", getAnnouncementsByClubId);
router.get("/members/:clubId", getMemberByClubId);

router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post("/:clubId/join-request", requestToJoinClub);
router.get("/clubLocation/:buildingId", clubLocation); // Path to get clubs by building ID

router.post("/create", upload.single("club_img"), createClub);
router.post("/admin/post/:clubId", upload.single("photo"), createPost);
router.post("/admin/announcements/:clubId", upload.none(), createAnnouncement); // Route to create an announcement

router.get("/", getAllClubs);

router.get("/:clubId/pending-requests", getPendingRequests);
router.put("/:clubId/members/:memberId/status", updateJoinRequestStatus);

router.get("/notifications", getNotifications);

export { router as clubRouter };