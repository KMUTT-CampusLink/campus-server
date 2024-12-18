import prisma from "../../../../../core/db/prismaInstance.js";

export const registeredCourseController = async (studId) => {
  try {
    
    const courses = await prisma.$queryRaw`
       select c.code as course_code, c.name as course_name
       from "enrollment_head" as eh, "enrollment_detail" as ed, "section" as s, "course" as c,"admin_control" as adc,"calendar" as  cal,"student"  as stu
      where eh.id = ed.head_id 
      and ed.section_id = s.id 
      and c.code = s.course_code  
      and eh.student_id=${studId}
      and stu.id=${studId}
      and adc.current_period=cal.id
      and cal.semester_id = eh.semester_id
      `;
    // console.log(courses)
    
    let fulfillment = `Here are your registered courses   \n`;
    courses.map((course, index) => {
      fulfillment += `${index + 1}. ${course.course_name}\n`;
    });
    
    return fulfillment;
    // res.status(200).json({fulfillment});
  } catch (error) {
    console.error("Error fetching registered course: " + error);
   return "Internal Server Error.";
  //  res.status(500).json({message:"Failed to fetch registered course"});
  }
};
