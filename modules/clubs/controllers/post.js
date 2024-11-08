import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

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
      where: {
        club_id: parseInt(clubId),
      },
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
