import { detectIntentText } from "./getReplyController.js";

export const receiveMessageController = async(req, res) => {
  const inputText = req.body.message.toLowerCase();
  const sessionId = req.body.sessionId;
  const projectId = process.env.BOT_PROJECT_ID;
  const reply = await detectIntentText(projectId, inputText, sessionId);
  // res.json({replyMessage: reply});
  res.json(reply);
}