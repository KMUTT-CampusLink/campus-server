import prisma from "../../../../../core/db/prismaInstance.js";

export const professorController = async(req, res)=>{
    const {courseName} = req.query;
    try{ 
        const professor = await prisma.$queryRaw`
        SELECT CONCAT(e.firstname,' ',e.lastname) as fullname
            FROM "course" AS c ,"section" AS s, "employee" as e, "professor" as p
            WHERE c.code = s.course_code
            AND p.section_id = s.id
            AND p.emp_id = e.id
            AND c.name = Upper(${courseName.trim()})`;
        console.log(professor);
        if (!professor || professor.length === 0) {
            res.status(404).json({ message: `Sorry, we could not find any information for the professor of ${courseName}.` });
        return `Sorry, we could not find any information for the professor of ${courseName}.`;
        }else{
            res.status(200).json({
                message: `${professor[0].fullname} is the professor for the ${courseName} course.`
            });
        }
        return `${professor[0].fullname} is the professor for the ${courseName} course.`;
    }
    catch(error){
        console.error("Error fetching professor name: " + error);
        res.status(500).json({ error: "Failed to fetch professor name" });
    //return "Failed to fetch professor name";
    }
}