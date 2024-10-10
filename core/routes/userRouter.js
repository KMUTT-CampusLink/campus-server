import { Router } from "express";
import login from "../controllers/login.js";
import activate from "../controllers/activate.js";
import logout from "../controllers/logout.js";
// import your logics from controllers here

const userRouter = Router();

// create routes here
userRouter.get("/", (req, res) => {
  return res.send("User");
});

userRouter.post("/login", login);
userRouter.post("/activate", activate);
userRouter.post("/logout", logout);

export { userRouter };
