import { detectIntentText } from "./getReplyController.js";

export const receiveMessageController = async(req, res) => {
  const inputText = req.body.message.toLowerCase();
  const sessionId = req.user.id; // req.user.id -> userId
  const bearerToken = req.token;
  const projectId = process.env.BOT_PROJECT_ID;
  const reply = await detectIntentText(projectId, inputText, sessionId, bearerToken);
  // res.json({replyMessage: reply});
  console.log(reply);
  res.json(reply);
}