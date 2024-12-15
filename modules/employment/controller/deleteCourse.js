import prisma from '../../../core/db/prismaInstance.js';

const deleteCourse = async (req,res) =>
{
    const {id:code} = req.params

    if (!code) {
        return res.status(400).json({ error: "Course Code is required." });
      }
  
      const existingCourse = await prisma.course.findUnique({
        where: { code },
      });
  
      if (!existingCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      const course = await prisma.course.findUnique({
        where: {course},
        select:{

        }
      })
}

export default deleteCourse;