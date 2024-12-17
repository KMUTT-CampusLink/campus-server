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
  updatePost,
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
import { reserveSeat, getReservationStatus, getJoinedEvents, cancelReservation, getEventParticipants } from "../controllers/reservation.js";
import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";

const router = Router();

router.get("/announcements/:id/participants", getEventParticipants); // Add route for event participants,
router.post("/events/status", getReservationStatus);
router.post("/events/cancel", cancelReservation);
router.get("/member/:memberId/joined-events", getJoinedEvents); // Add route for joined events

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
router.put("/posts/:id", updatePost);

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
router.post(
  "/admin/post/:clubId",
  file_uploader.single("photo"),
  multerErrorHandler,
  createPost
);
router.post("/admin/announcements/:clubId", createAnnouncement);

router.get("/notifications", getNotifications);
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
router.delete("/:id", deleteClub); // Placed last to avoid conflicts with other /:id routes

// Pending requests
router.get("/:clubId/pending-requests", getPendingRequests);

export { router as clubRouter };
