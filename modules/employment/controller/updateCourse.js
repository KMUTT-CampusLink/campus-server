import prisma from "../../../core/db/prismaInstance.js";

const updateCourse = async (req, res) => {
  const { id: code } = req.params;
  const { data } = req.body;
  const parsedData = JSON.parse(data);
  const { name, program_id, description, objective } = parsedData;

  console.log("Request body:", req.body);
  console.log("Request body:", parsedData);
  const image = req.file;
  console.log("pic", image);

  try {
    if (!code) {
      return res.status(400).json({ error: "Course Code is required." });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code }, // Use the extracted string value
    });

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (program_id) updatedFields.program_id = parseInt(program_id, 10);
    if (description) updatedFields.description = description;
    if (objective) updatedFields.objective = objective;
    if (image) updatedFields.image = image.objName;

    const updatedCourse = await prisma.course.update({
      where: { code },
      data: updatedFields,
    });

    console.log("Updated Student:", updatedFields);

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error in updateCourse:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateCourse;
