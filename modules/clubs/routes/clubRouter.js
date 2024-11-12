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

import { getAllPosts, getPostByClubId, createPost, togglePostPin } from "../controllers/post.js";
import { getAllAnnouncements, createAnnouncement, getAnnouncementsByClubId, toggleAnnouncementPin } from "../controllers/announcement.js";
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

router.put("/member/:memberId/lineID", updateLineID); // Update lineID in club_member table
router.get("/member/:memberId/clubs", getClubByMemberId); // Fetch clubs by member ID

// Fetch all students and professors
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentbyId);
router.get("/professors", getAllProfessors);
router.get("/buildings", getAllBuildings);

// Fetch all clubs and specific club details
router.get("/", getAllClubs);
router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post("/create", upload.single("club_img"), createClub);

// Fetch posts and announcements
router.get("/posts", getAllPosts);
router.get("/posts/:clubId", getPostByClubId);
router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:clubId", getAnnouncementsByClubId);

// Pin post and announcement routes
router.patch("/post/:id/pin", togglePostPin); // Pin/Unpin a post
router.patch("/announcements/:id/pin", toggleAnnouncementPin); // Pin/Unpin an announcement

// Member and join request routes
router.get("/members/:clubId", getMemberByClubId);
router.post("/:clubId/join-request", requestToJoinClub);
router.put("/:clubId/members/:memberId/status", updateJoinRequestStatus);

// Admin-specific routes (e.g., creating posts and announcements)
router.post("/admin/post/:clubId", upload.single("photo"), createPost);
router.post("/admin/announcements/:clubId", upload.none(), createAnnouncement); 

// Notifications and pending requests
router.get("/notifications", getNotifications);
router.get("/:clubId/pending-requests", getPendingRequests);

export { router as clubRouter };