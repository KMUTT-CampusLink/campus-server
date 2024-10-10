import { Router } from "express";
import activate from "../controllers/users/activate.js";
import login from "../controllers/users/login.js";
import logout from "../controllers/users/logout.js";
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
