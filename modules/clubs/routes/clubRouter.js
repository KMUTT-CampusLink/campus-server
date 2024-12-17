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

import {
  reserveSeat,
  getReservationStatus,
  getJoinedEvents,
  cancelReservation,
  getEventParticipants,
} from "../controllers/reservation.js";

import multerErrorHandler from "../../../core/middleware/multerErrorHandler.js";
import file_uploader from "../../../core/middleware/multerUploader.js";

const router = Router();

// ===== EVENTS & RESERVATION ROUTES =====
router.get("/announcements/:id/participants", getEventParticipants);
router.post("/events/status", getReservationStatus);
router.post("/events/cancel", cancelReservation);
router.post("/events/reserve", reserveSeat);
router.get("/member/:memberId/joined-events", getJoinedEvents);

// ===== MEMBER ROUTES =====
router.put("/member/:memberId/lineID", updateLineID);
router.get("/member/:memberId/clubs", getClubByMemberId);
router.get("/members/:clubId", getMemberByClubId);
router.get("/membership/:clubId", getMembershipStatus);

// ===== POSTS ROUTES =====
router.get("/posts", getAllPosts);
router.get("/posts/:clubId", getPostByClubId);
router.delete("/posts/:id", deletePost);
router.patch("/posts/:id/pin", togglePostPin);
router.put("/posts/:id", updatePost);

// ===== ANNOUNCEMENTS ROUTES =====
router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:clubId", getAnnouncementsByClubId);
router.get("/announcements/:announcementId/price", getAnnouncementPriceById);
router.delete("/announcements/:id", deleteAnnouncement);
router.patch("/announcements/:id/pin", toggleAnnouncementPin);
router.put("/announcements/:id", updateAnnouncement);

// ===== ADMIN ROUTES =====
router.post(
  "/admin/post/:clubId",
  file_uploader.single("photo"),
  multerErrorHandler,
  createPost
);
router.post(
  "/admin/announcements/:clubId",
  file_uploader.single("announcementFile"),
  multerErrorHandler,
  createAnnouncement
);

// ===== JOIN REQUEST ROUTES =====
router.post("/:clubId/join-request", requestToJoinClub);
router.get("/:clubId/pending-requests", getPendingRequests);
router.put("/:clubId/members/:memberId/status", updateJoinRequestStatus);

// ===== FETCH ALL USERS/ENTITIES =====
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentbyId);
router.get("/professors", getAllProfessors);
router.get("/buildings", getAllBuildings);
router.get("/notifications", getNotifications);

// ===== CLUB ROUTES =====
router.get("/", getAllClubs); // Fetch all clubs
router.get("/:id", getClubbyId); // Fetch single club by ID
router.put("/:id", updateClubDescription); // Update club description
router.post(
  "/create",
  file_uploader.single("clubImage"),
  multerErrorHandler,
  createClub
);
router.delete("/:id", deleteClub); // Delete club by ID

export { router as clubRouter };