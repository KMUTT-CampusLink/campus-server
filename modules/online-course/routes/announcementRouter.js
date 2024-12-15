import { Router } from "express";
import { createAnnouncement, getUpComingAnnouncement } from "../controllers/announcementController.js";


const announcementRouter = Router();

announcementRouter.post("/create", createAnnouncement);
announcementRouter.get("/:sectionID", getUpComingAnnouncement);

export { announcementRouter };