import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { logger } from "./middleware/logger.js";
import { corsConfig } from "./config/corsConfig.js";
import { verifyAccessToken } from "../modules/registration/middleware/jwtHandler.js";

// routes
import { userRouter } from "../modules/registration/routes/userRouter.js";
import { attendRouter } from "../modules/attendance/routes/attendRouter.js";
import { secureRouter } from "../modules/building-security/routes/secureRouter.js";
import { botRouter } from "../modules/chatbot/routes/botRouter.js";
import { clubRouter } from "../modules/clubs/routes/clubRouter.js";
import { employRouter } from "../modules/employment/routes/employRouter.js";
import { libRouter } from "../modules/library/routes/libRouter.js";
import { mapRouter } from "../modules/map/routes/mapRouter.js";
import { courseRouter } from "../modules/online-course/routes/courseRouter.js";
import { examRouter } from "../modules/online-exam/routes/examRouter.js";
import { parkRouter } from "../modules/parking-and-bike/routes/parkRouter.js";
import { paymentRouter } from "../modules/payment/routes/paymentRouter.js";
import { regisRouter } from "../modules/registration/routes/regisRouter.js";
import { transRouter } from "../modules/transportation/routes/transRouter.js";

const app = express();
const port = process.env.PORT || 3000;

// logger middleware
app.use(logger);

// cookie parser middleware
app.use(cookieParser());

// cors configuration
app.use(cors(corsConfig));

// urlencoded form data
app.use(express.urlencoded({ extended: false }));

// json middleware
app.use(express.json());

// all routing
app.use("/api/users", userRouter);
app.get("/api/authorize", verifyAccessToken, (req, res) => {
  return res.status(200).json({
    condition: "success",
    data: {
      id: req.user.id,
      role: req.user.role,
    },
    message: "User is authorized",
  });
});
app.use("/api/regis", verifyAccessToken, regisRouter);
app.use("/api/attend", verifyAccessToken, attendRouter);
app.use("/api/security", verifyAccessToken, secureRouter);
app.use("/api/botastra", verifyAccessToken, botRouter);
app.use("/api/clubs", verifyAccessToken, clubRouter);
app.use("/api/employ", employRouter);
app.use("/api/library", verifyAccessToken, libRouter);
app.use("/api/map", mapRouter);
app.use("/api/courses", verifyAccessToken, courseRouter);
app.use("/api/exams", verifyAccessToken, examRouter);
app.use("/api/parking", verifyAccessToken, parkRouter);
app.use("/api/payment", verifyAccessToken, paymentRouter);
app.use("/api/transport", verifyAccessToken, transRouter);

app.listen(port, () =>
  console.log(`[server] running on port ${process.env.HOSTNAME}:${port}`)
);
