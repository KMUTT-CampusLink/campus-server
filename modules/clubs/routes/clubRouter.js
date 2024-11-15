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
  deleteClub
} from "../controllers/club.js";

import { getAllPosts, getPostByClubId, createPost, togglePostPin, deletePost } from "../controllers/post.js";
import { getAllAnnouncements, createAnnouncement, getAnnouncementsByClubId, toggleAnnouncementPin, deleteAnnouncement } from "../controllers/announcement.js";
import { getAllBuildings } from "../controllers/building.js";
import { clubLocation } from "../controllers/clubLocation.js";
import { getMemberByClubId, getClubByMemberId, updateLineID} from "../controllers/clubMember.js";
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

// Update lineID in club_member table
router.put("/member/:memberId/lineID", updateLineID);
router.get("/member/:memberId/clubs", getClubByMemberId);

// Fetch all students and professors
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentbyId);
router.get("/professors", getAllProfessors);
router.get("/buildings", getAllBuildings);

// Fetch posts and announcements, and pin/unpin or delete them
router.get("/posts", getAllPosts);
router.get("/posts/:clubId", getPostByClubId);
router.delete("/posts/:id", deletePost);
router.patch("/post/:id/pin", togglePostPin);

router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:clubId", getAnnouncementsByClubId);
router.delete("/announcements/:id", deleteAnnouncement);
router.patch("/announcements/:id/pin", toggleAnnouncementPin);

// Member and join request routes
router.get("/members/:clubId", getMemberByClubId);
router.post("/:clubId/join-request", requestToJoinClub);
router.put("/:clubId/members/:memberId/status", updateJoinRequestStatus);

// Admin-specific routes (e.g., creating posts and announcements)
router.post("/admin/post/:clubId", upload.single("photo"), createPost);
router.post("/admin/announcements/:clubId", upload.none(), createAnnouncement); 

// Club-specific routes
router.get("/", getAllClubs);
router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post("/create", upload.single("club_img"), createClub);
router.delete("/:id", deleteClub); // Placed last to avoid conflicts with other `/:id` routes

// Notifications and pending requests
router.get("/notifications", getNotifications);
router.get("/:clubId/pending-requests", getPendingRequests);

export { router as clubRouter };