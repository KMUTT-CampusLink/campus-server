import { Router } from "express";

import {
  createDiscussionTopic,
  updateDiscussionTopic,
  deleteDiscussionTopic,
  createDiscussionReply,
  updateDiscussionReply,
  deleteDiscussionReply,
} from "../controllers/discussionController.js";

const discussionRouter = Router();

discussionRouter.post("/upload", createDiscussionTopic);
discussionRouter.put("/:topicId/edit", updateDiscussionTopic);
discussionRouter.delete("/:topicId/delete", deleteDiscussionTopic);
discussionRouter.post("/comment/create", createDiscussionReply);
discussionRouter.put("/comment/:commentId/edit", updateDiscussionReply);
discussionRouter.delete("/comment/:commentId/delete", deleteDiscussionReply)

export {discussionRouter}