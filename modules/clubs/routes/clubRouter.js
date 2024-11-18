import { Router } from "express";
import {
  getAllStudents,
  getStudentbyId,
  getAllClubs,
  createClub,
  getClubbyId,
  getAllProfessors,
  updateClubDescription,
  deleteClub,
} from "../controllers/club.js";

import {
  getAllPosts,
  getPostByClubId,
  createPost,
  togglePostPin,
  deletePost,
} from "../controllers/post.js";
import {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementsByClubId,
  toggleAnnouncementPin,
  deleteAnnouncement,
  updateAnnouncement,
  getAnnouncementPriceById,
} from "../controllers/announcement.js";
import { getAllBuildings } from "../controllers/building.js";
import { clubLocation } from "../controllers/clubLocation.js";
import {
  getMemberByClubId,
  getClubByMemberId,
  updateLineID,
  getMembershipStatus,
} from "../controllers/clubMember.js";
import { getNotifications } from "../controllers/clubNotifications.js";
import {
  requestToJoinClub,
  getPendingRequests,
  updateJoinRequestStatus,
} from "../controllers/request.js";
import { reserveSeat } from "../controllers/reservation.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";

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
router.put("/announcements/:id", updateAnnouncement);

router.get("/announcements/:announcementId/price", getAnnouncementPriceById);

router.post("/events/reserve", reserveSeat); // Add the reserveSeat route

// Member and join request routes
router.get("/members/:clubId", getMemberByClubId);
router.get("/membership/:clubId", getMembershipStatus);
router.post("/:clubId/join-request", requestToJoinClub);
router.put("/:clubId/members/:memberId/status", updateJoinRequestStatus);

// Admin-specific routes (e.g., creating posts and announcements)
router.post("/admin/post/:clubId", createPost);
router.post("/admin/announcements/:clubId", createAnnouncement);

// Club-specific routes
router.get("/", getAllClubs);
router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post(
  "/create",
  file_uploader.single("clubImage"),
  multerErrorHandler,
  createClub
);
router.delete("/:id", deleteClub); // Placed last to avoid conflicts with other `/:id` routes

// Notifications and pending requests
router.get("/notifications", getNotifications);
router.get("/:clubId/pending-requests", getPendingRequests);

export { router as clubRouter };
