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

export const addCourseMaterials = async (req, res) => {
  const { title, sec_id } = req.body;
  console.log(title);
  console.log(sec_id);

  try {
    // Extract the video file
    const videoFile = req.files.videoFile[0];
    const videoFileData = {
      objName: videoFile.objName,
      originalName: videoFile.originalname,
    };
    console.log("Video file:", videoFileData);

    // Create the new video record
    const newVideo = await prisma.course_video.create({
      data: {
        title: title,
        section_id: parseInt(sec_id),
        video_url: videoFileData.objName,
      },
    });

    console.log("New Video Created:", newVideo);

    // Loop through the material files and get only the objName
    const materialFiles = req.files.materialFiles || [];
    const materialFileURLs = materialFiles.map((file) => ({
      objName: file.objName,
      originalName: file.originalname,
    }));

    console.log("Material files:", materialFileURLs);

    // Loop through materialFileURLs and insert into course_attachment model
    const courseAttachments = materialFileURLs.map((file) => ({
      course_video_id: newVideo.id, // Assign the new video ID to the attachment
      file_path: file.objName, // Store the objName as file_path
      //file_name: file.originalName, // You can store the original file name if needed
    }));

    // Insert all attachments into the database
    const createdAttachments = await prisma.course_attachment.createMany({
      data: courseAttachments,
    });

    console.log("Created course attachments:", createdAttachments);

    res.status(200).json({
      message: "Files uploaded successfully!",
      videoFile: videoFileData,
      materialFileURLs,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
