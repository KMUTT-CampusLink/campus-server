import { Router } from "express";
import { getAllLibraryEvents } from "../controllers/getAllLibraryEvents.js";
import { getAllLibraryAnnouncements } from "../controllers/getAllLibraryAnnouncements.js";
import { getAllBook } from "../controllers/getAllBook.js";
import { getAllBookRes } from "../controllers/getAllBookRes.js";
import { getAllCategory } from "../controllers/getAllCategory.js";
import { getAllBooknCate } from "../controllers/getAllBooknCate.js";
import { getAllDupeRes } from "../controllers/getAllDupeRes.js";
import { createReservation } from "../controllers/createReservation.js";
import { updateReturnBook } from "../controllers/updateReturnBook.js";
// import your logics from controllers here

const libRouter = Router();
libRouter.get("/event", getAllLibraryEvents);
libRouter.get("/annouce", getAllLibraryAnnouncements);
libRouter.get("/allBook", getAllBook);
libRouter.get("/res", getAllBookRes);
libRouter.get("/category", getAllCategory);
libRouter.get("/book", getAllBooknCate);
libRouter.get("/allDupe", getAllDupeRes);
libRouter.post("/reservation", createReservation);
libRouter.post("/returnBook", updateReturnBook);
// create routes here

libRouter.get("/", (req, res) => {
  return res.send("Library System");
});

export { libRouter };
