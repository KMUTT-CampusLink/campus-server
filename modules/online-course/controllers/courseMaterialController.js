import prisma from "../../../core/db/prismaInstance.js";

export const addVideo = async (req, res) => {
  const { title, sec_id } = req.body;
  console.log(title);
  console.log(sec_id);

  try {
    console.log(req.file.objName);
    const newVideo = await prisma.course_video.create({
      data: {
        title: title,
        section_id: parseInt(sec_id),
        video_url: req.file.objName,
      },
    });

    console.log(newVideo);
    return res.status(200).json(newVideo);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.$queryRaw`
      SELECT *
      FROM course_video
      ORDER BY created_at`;
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json(error);
  }
};
