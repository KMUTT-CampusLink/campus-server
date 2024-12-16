import { Router } from "express";
import { createAnnouncement, getUpComingAnnouncement, deleteAnnouncement, getAnnouncementByProfessor } from "../controllers/announcementController.js";


const announcementRouter = Router();

announcementRouter.post("/", createAnnouncement);
announcementRouter.get("/:studentID", getUpComingAnnouncement);
announcementRouter.get("/teacher/:empID/:sectionID", getAnnouncementByProfessor);
announcementRouter.delete("/", deleteAnnouncement);

export { announcementRouter };