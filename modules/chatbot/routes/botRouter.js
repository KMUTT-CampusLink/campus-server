import { Router } from "express";
// import your logics from controllers here

const botRouter = Router();

// create routes here
botRouter.get("/", (req, res) => {
  return res.send("Bot Astra");
});

export { botRouter };
