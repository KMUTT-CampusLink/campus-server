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
// app.use("/api/users", userRouter);
// app.use(verifyAccessToken);
app.get("/api/authorize", (req, res) => {
  return res.status(200).json({
    condition: "success",
    data: req.user.role,
    message: "Authorized",
  });
});

app.use("/api/regis", regisRouter);
app.use("/api/attend", attendRouter);
app.use("/api/security", secureRouter);
app.use("/api/botastra", botRouter);
app.use("/api/clubs", clubRouter);
app.use("/api/employ", employRouter);
app.use("/api/library", libRouter);
app.use("/api/map", mapRouter);
app.use("/api/courses", courseRouter);
app.use("/api/exams", examRouter);
app.use("/api/parking", parkRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/transport", transRouter);

app.listen(port, () =>
  console.log(`Application started on port ${process.env.HOSTNAME}:${port}`)
);
