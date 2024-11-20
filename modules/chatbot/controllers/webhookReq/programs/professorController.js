import prisma from "../../../../../core/db/prismaInstance.js";

export const professorController = async(courseName)=>{
    try{ 
        const professor = await prisma.$queryRaw`
        SELECT CONCAT(e.firstname,' ',e.lastname) as fullname
            FROM "course" AS c ,"section" AS s, "employee" as e, "professor" as p
            WHERE c.code = s.course_code
            AND p.section_id = s.id
            AND p.emp_id = e.id
            AND c.name = ${courseName}`;
        if (!professor || professor.length === 0) {
            return `Sorry, we could not find any information for the professor of ${courseName}.`;
        }else{
            return `${professor[0].fullname} is the professor for the ${courseName} course.`;
        }
    }
    catch(error){
        console.error("Error fetching professor name: " + error);
        // res.status(500).json({ error: "Failed to fetch professor name" });
        return "Failed to fetch professor name";
    }
}