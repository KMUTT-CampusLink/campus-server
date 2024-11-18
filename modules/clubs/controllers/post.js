import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

// Create a new post
export const createPost = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("File:", req.file); // Check if multer is correctly receiving the file

  const { clubId } = req.params;
  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;
  const memberId = 1028; // Hardcoded for now
  const post_img = req.file ? req.file.filename : null;

  try {
    const newPost = await prisma.club_post.create({
      data: {
        title: postTitle,
        content: postContent,
        post_img: post_img,
        club_id: parseInt(clubId),
        member_id: memberId,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error); // Log the actual error
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the post.",
      error: error.message, // Return the error message for debugging
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.club_post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        post_img: true,
        club: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch posts" });
  }
};

export const getPostByClubId = async (req, res) => {
  const { clubId } = req.params;

  try {
    const posts = await prisma.club_post.findMany({
      where: { club_id: parseInt(clubId) },
      orderBy: { is_pinned: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        post_img: true,
        is_pinned: true,
        club: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch posts" });
  }
};

// Toggle pin status for a post
export const togglePostPin = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.club_post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Toggle the `is_pinned` status and update
    const updatedPost = await prisma.club_post.update({
      where: { id: parseInt(id) },
      data: { is_pinned: !post.is_pinned },
    });

    return res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Error toggling post pin status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle post pin status",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.club_post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await prisma.club_post.delete({
      where: { id: parseInt(id) },
    });

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
