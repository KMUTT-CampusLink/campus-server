import prisma from "../../../../../core/db/prismaInstance.js";

export const requirecourseController = async (req, res) => {
    const {  progName, degreeLevel } = req.query;
  try {
    
    const courses = await prisma.$queryRaw`
      Select c.name as coursename --p.name as programname
      From "course" as c,"program" as p,"degree"as d
      Where c.program_id=p.id 
      AND   p.id=d.program_id
      And p.name = ${progName}
      And d.degree_level=${degreeLevel}::education_level_enum;   
    `;
    
    let fulfillment = `The required course for  "${progName}" (${degreeLevel}) are. \n`;
    courses.map((course, index) => {
      fulfillment += `${index + 1}. ${course.coursename}\n`;
    });
    
    //console.log(fulfillment);
    //return fulfillment;
    res.status(200).json({fulfillment});
  } catch (error) {
    console.error("Error fetching required course: " + error);
   // return "Failed to fetch required courses";
   res.status(500).json({message:"Failed to fetch required course"});
  }
};
