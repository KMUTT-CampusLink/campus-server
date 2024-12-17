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
  const { section_id } = req.params; // Extract section_id from request parameters

  try {
    const videos = await prisma.course_video.findMany({
      where: {
        section_id: parseInt(section_id), // Filter by section_id from params
      },
      orderBy: {
        created_at: "asc", // You can use 'desc' for descending order
      },
      include: {
        course_attachment: true, // Include the related course_attachment models
      },
    });

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
      file_name: file.originalName, // You can store the original file name if needed
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

//edit and delete courseMaterial

export const editCourseMaterial = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    // Check if new video file is uploaded
    const videoFile = req.file?.objName;

    const updatedMaterial = await prisma.course_video.update({
      where: { id: parseInt(id) },
      data: {
        title,
        video_url: videoFile || undefined, // Update only if a new file is uploaded
        updated_at: new Date(),
      },
    });

    return res.status(200).json(updatedMaterial);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update material", error });
  }
};

export const deleteCourseMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete attachments first to maintain referential integrity
    await prisma.course_attachment.deleteMany({
      where: { course_video_id: parseInt(id) },
    });

    // Delete the video record
    await prisma.course_video.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Course material deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete material", error });
  }
};
