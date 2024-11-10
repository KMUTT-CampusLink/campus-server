import prisma from "../../../../../core/db/prismaInstance.js";

export const requirecourseController = async (req, res) => {
    const { name: progName } = req.query;
  try {
    
    const courses = await prisma.$queryRaw`
      Select c.name as coursename--p.name as programname
      From course as c,program as p
      Where c.program_id=p.id and p.name = ${progName}
    `;
    
    let fulfillment = `The required course for  "${progName}" are. \n`;
    courses.map((course, index) => {
      fulfillment += `${index + 1}. ${course.coursename}\n`;
    });
    
    return fulfillment;
  } catch (error) {
    console.error("Error fetching required course: " + error);
    return "Failed to fetch required courses";
  }
};
