import { Router } from "express";
// import your logics from controllers here
import { getAllStudents, getStudentbyId, getAllClubs, createClub, getClubbyId, requestToJoinClub, createPost, getAllProfessors, updateClubDescription} from "../controllers/club.js"; // Import the controller
import { getAllBuildings } from "../controllers/building.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage }); // Configure multer storage

const router = Router();

router.get("/students", getAllStudents);
router.get("/professors", getAllProfessors);
router.get("/buildings", getAllBuildings);
router.get("/students/:id", getStudentbyId);
router.post("/clubs/:clubId/request", requestToJoinClub);

router.get("/", getAllClubs);
router.get("/:id", getClubbyId);
router.put("/:id", updateClubDescription);
router.post("/create", upload.single('club_img'), createClub);
router.post("/admin/post", upload.single("photo"), createPost);

export { router as clubRouter };
