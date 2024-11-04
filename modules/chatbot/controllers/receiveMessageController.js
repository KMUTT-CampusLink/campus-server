import { detectIntentText } from "./getReplyController.js";
import prisma from "../../../core/db/prismaInstance.js";

export const receiveMessageController = async(req, res) => {
  const inputText = req.body.message;
  const sessionId = req.body.sessionId;
  const projectId = process.env.BOT_PROJECT_ID;
  const reply = await detectIntentText(projectId, inputText, sessionId);
  res.json({replyMessage: reply});
}