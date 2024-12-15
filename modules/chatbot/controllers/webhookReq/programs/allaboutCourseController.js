import prisma from "../../../../../core/db/prismaInstance.js";

export const allaboutCourseController = async (courseName) => {
  try {
    const infos = await prisma.$queryRaw`
      SELECT c.name ,c.description as course_description, c.objective as club_objective, c.credits as course_credits,c.type as course_type
      FROM "course" as c 
      where c.name=${courseName}
    `;
    if(!infos || infos.length === 0){
      return `I do not have the information about ${courseName} right now?`;
    }
    let fulfillment = `The general information for the "${courseName}" are as follows.\n`;
    infos.map((info, index) => {
      fulfillment += `Name: ${courseName}\nDescription: ${info.course_description}\nObjective:${info.club_objective}\nCredits: ${info.course_credits}\nType: ${info.course_type}`;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching information for this course: " + error);
    // res.status(500).json({ error: "Failed to fetch information for this course" });
    return "Internal Server Error";
  }
};
