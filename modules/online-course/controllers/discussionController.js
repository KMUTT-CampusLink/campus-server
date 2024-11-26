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
      where: { id: parseInt(section_id) },
    });
    if (!sectionExists) {
      return res.status(404).json({
        message: "The specified section_id does not exist.",
      });
    }
    
    const sectionIdParsed = parseInt(section_id, 10); // Base 10 parsing
    if (isNaN(sectionIdParsed)) {
      return res.status(400).json({ message: "Invalid section_id" });
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
        section_id: sectionIdParsed,
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

export const getAllDiscussionPostsBySectionID = async (req, res) => {
  const { sectionID } = req.params;
  const intSectionID = parseInt(sectionID, 10);

  if (isNaN(intSectionID)) {
    return res.status(400).json({ message: "Invalid section ID." });
  }

  try {
    // Fetch all discussion posts with post owner's name
    const discussionPosts = await prisma.$queryRaw`
      SELECT 
        dt.id,
        dt.section_id,
        dt.user_id,
        dt.title,
        dt.content,
        dt.discussion_img AS img,
        dt.create_at,
        CASE 
          WHEN u.role = 'Student' THEN CONCAT(st.firstname, ' ', st.lastname)
          WHEN u.role = 'Professor' THEN CONCAT(e.firstname, ' ', e.lastname)
          ELSE 'Unknown'
        END AS owner_name
      FROM discussion_topic dt
      LEFT JOIN "user" u ON dt.user_id = u.id
      LEFT JOIN student st ON u.id = st.user_id
      LEFT JOIN employee e ON u.id = e.user_id
      WHERE dt.section_id = ${intSectionID};
    `;

    return res.status(200).json(discussionPosts);
  } catch (error) {
    console.error("Error fetching discussion posts:", error);
    return res.status(500).json({
      message: "An error occurred while fetching discussion posts.",
      error: error.message,
    });
  }
};

export const getAllCommentsByPostID = async (req, res) => {
  const { postID } = req.params;
  const intPostID = parseInt(postID, 10);

  if (isNaN(intPostID)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    // Fetch all comments with commenter details
    const comments = await prisma.$queryRaw`
      SELECT
    dr.id AS comment_id,
    dr.content AS comment_content,
    dr.create_at AS comment_created_at,
    dr.user_id,
    dt.id AS topic_id,
    dt.title AS topic_title,
    dt.content AS topic_content,
    dt.create_at AS topic_created_at,
    u.id AS user_id,
    u.role AS user_role,
    CASE
        WHEN u.role = 'Student' THEN CONCAT(st.firstname, ' ', st.lastname)
        WHEN u.role = 'Professor' THEN CONCAT(e.firstname, ' ', e.lastname)
        ELSE 'Unknown'
        END AS user_fullname
FROM discussion_reply dr
         JOIN discussion_topic dt ON dr.topic_id = dt.id
         JOIN "user" u ON dr.user_id = u.id
         LEFT JOIN student st ON u.id = st.user_id
         LEFT JOIN employee e ON u.id = e.user_id
WHERE dt.id = ${intPostID}

      ORDER BY dr.create_at ASC;
    `;

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "An error occurred while fetching comments.",
      error: error.message,
    });
  }
};

