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
import { getAllBookDupe } from "../controllers/getAllBookDupe.js";

const libRouter = Router();
libRouter.get("/event", getAllLibraryEvents);
libRouter.get("/announce", getAllLibraryAnnouncements);
libRouter.get("/allBook", getAllBook);
libRouter.get("/res", getAllBookRes);
libRouter.get("/category", getAllCategory);
libRouter.get("/book", getAllBooknCate);
libRouter.get("/allDupe", getAllDupeRes);
libRouter.post("/reservations", createReservation);
libRouter.post("/returnBook", updateReturnBook);
libRouter.get("/bookDupe", getAllBookDupe);

libRouter.get("/", (req, res) => {
  return res.send("Library System");
});

export { libRouter };
