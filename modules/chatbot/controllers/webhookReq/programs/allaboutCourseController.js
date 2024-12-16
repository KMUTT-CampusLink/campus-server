import prisma from "../../../../../core/db/prismaInstance.js";

export const allaboutCourseController = async (req, res) => {
    const{courseName}=req.query;
  try {

    const infos = await prisma.$queryRaw`
      SELECT c.name ,c.description as course_description, c.objective as club_objective, c.credits as course_credits,c.type as course_type
      FROM "course" as c 
      where c.name=${courseName}
    `;

   
    let fulfillment = `The general information for the "${courseName}" are as follows\ `;
    infos.map((info, index) => {
      fulfillment += `${index + 1}. Name: ${courseName}\n   Description: ${info.course_description}\n  Objective:${info.club_objective}\n
                                     Credits: ${info.course_credits}\n
                                     Type: ${info.course_type}`;
    });

    return res.json({ fulfillment });
  } catch (error) {
    console.error("Error fetching information for this course: " + error);
    res.status(500).json({ error: "Failed to fetch information for this course" });
  }
};
