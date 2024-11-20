import prisma from "../../../core/db/prismaInstance.js";

export const createDiscussionTopic = async (req, res) => {
  try {
    const { section_id, user_id, title, content, discussion_img } = req.body;

    // Validate required fields
    if (!section_id || !user_id || !title) {
      return res.status(400).json({
        message: "section_id, user_id, and title are required.",
      });
    }

    // Check if section_id exists
    const sectionExists = await prisma.section.findUnique({
      where: { id: section_id },
    });
    if (!sectionExists) {
      return res.status(404).json({
        message: "The specified section_id does not exist.",
      });
    }

    // Check if user_id exists
    const userExists = await prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!userExists) {
      return res.status(404).json({
        message: "The specified user_id does not exist.",
      });
    }

    // Create a new discussion topic
    const newTopic = await prisma.discussion_topic.create({
      data: {
        section_id,
        user_id,
        title,
        content,
        discussion_img,
        create_at: new Date(),
        updated_at: new Date(),
      },
    });

    return res.status(201).json({
      message: "Discussion topic created successfully.",
      topic: newTopic,
    });
  } catch (error) {
    console.error("Error creating discussion topic:", error);
    return res.status(500).json({
      message: "An error occurred while creating the discussion topic.",
      error,
    });
  }
};



export const updateDiscussionTopic = async (req, res) => {
  try {
    const { topicId } = req.params; // Topic ID from route parameters
    const { title, content, discussion_img } = req.body; // Fields to update

    // Validate input
    if (!title && !content && !discussion_img) {
      return res.status(400).json({
        message:
          "At least one of title, content, or discussion_img is required.",
      });
    }

    // Check if the topic exists
    const topic = await prisma.discussion_topic.findUnique({
      where: { id: parseInt(topicId, 10) }, // Ensure correct property name
    });
    if (!topicId) {
      return res.status(404).json({ message: "Discussion topic not found." });
    }

    // Update the discussion topic
    const updatedTopic = await prisma.discussion_topic.update({
      where: { id: parseInt(topicId, 10) }, // Ensure correct property name
      data: {
        title,
        content,
        discussion_img,
        updated_at: new Date(),
      },
    });

    return res.status(200).json({
      message: "Discussion topic updated successfully.",
      topic: updatedTopic,
    });
  } catch (error) {
    console.error("Error updating discussion topic:", error);
    return res.status(500).json({
      message: "An error occurred while updating the discussion topic.",
      error,
    });
  }
};



export const deleteDiscussionTopic = async (req, res) => {
  try {
    const { topicId } = req.params; // Topic ID from route parameters

    // Check if the topic exists
    const topic = await prisma.discussion_topic.findUnique({
      where: { id: parseInt(topicId, 10) },
    });
    if (!topic) {
      return res.status(404).json({ message: "Discussion topic not found." });
    }

    // Delete the discussion topic
    await prisma.discussion_topic.delete({
      where: { id: parseInt(topicId, 10) },
    });

    return res.status(200).json({
      message: "Discussion topic deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the discussion topic.",
      error,
    });
  }
};


export const createDiscussionReply = async (req, res) => {
  try {
    const { topic_id, user_id, content } = req.body;

    // Validate required fields
    if (!topic_id || !user_id || !content) {
      return res.status(400).json({
        message: "topic_id, user_id, and content are required.",
      });
    }

    // Check if the topic exists
    const topicExists = await prisma.discussion_topic.findUnique({
      where: { id: topic_id },
    });
    if (!topicExists) {
      return res.status(404).json({ message: "Discussion topic not found." });
    }

    // Create a new discussion reply
    const newReply = await prisma.discussion_reply.create({
      data: {
        topic_id,
        user_id,
        content,
        create_at: new Date(),
        updated_at: new Date(),
      },
    });

    return res.status(201).json({
      message: "Discussion reply created successfully.",
      reply: newReply,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the discussion reply.",
      error,
    });
  }
};


export const updateDiscussionReply = async (req, res) => {
  try {
    const { commentId } = req.params; // Reply ID from route parameters
    const { user_id, content } = req.body; // Updated content

    // Validate input
    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    // Check if the reply exists
    const reply = await prisma.discussion_reply.findUnique({
      where: { id: parseInt(commentId, 10) },
    });
    if (!reply) {
      return res.status(404).json({ message: "Discussion reply not found." });
    }

    // Check ownership
    if (reply.user_id !== user_id) {
      return res.status(403).json({ message: "Permission denied." });
    }

    // Update the reply
    const updatedReply = await prisma.discussion_reply.update({
      where: { id: parseInt(commentId, 10) },
      data: {
        content,
        updated_at: new Date(),
      },
    });

    return res.status(200).json({
      message: "Discussion reply updated successfully.",
      reply: updatedReply,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the discussion reply.",
      error,
    });
  }
};

export const deleteDiscussionReply = async (req, res) => {
  try {
    const { commentId} = req.params; // Reply ID from route parameters
    const { user_id } = req.body; // User performing the action

    // Check if the reply exists
    const reply = await prisma.discussion_reply.findUnique({
      where: { id: parseInt(commentId, 10) },
    });
    if (!reply) {
      return res.status(404).json({ message: "Discussion reply not found." });
    }

    // Check ownership
    if (reply.user_id !== user_id) {
      return res.status(403).json({ message: "Permission denied." });
    }

    // Delete the reply
    await prisma.discussion_reply.delete({
      where: { id: parseInt(commentId, 10) },
    });

    return res.status(200).json({
      message: "Discussion reply deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the discussion reply.",
      error,
    });
  }
};