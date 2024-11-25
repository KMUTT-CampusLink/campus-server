import prisma from "../../../../../core/db/prismaInstance.js";

export const professorContactController = async(courseName, sectionName) =>{
    try{
        const contact = await prisma.$queryRaw`
        SELECT CONCAT(e.firstname
        ,
        Case
            When e.midname IS NOT NULL THEN CONCAT(' ', e.midname)
            ELSE ''
        END
        ,
        ' ',e.lastname) as fullname, e.phone, u.personal_email
        FROM "user" as u, "professor" as p, "course" as c, "section" as s, "employee" as e
        WHERE c.name = ${courseName}
        AND c.code = s.course_code
        AND s.name = ${sectionName}
        AND p.section_id = s.id
        AND p.emp_id = e.id
        AND e.user_id = u.id;
        `;

        if(!contact || contact.length === 0){
            // res.status(404).json({message: `We could not find the professor of the ${courseName} course ${sectionName}. Please make sure the course name and the section are exactly correct since the chatbot is case sensitive. For example, "Introduction to Phonetics" and "introductiontophonetic" are not the same and make sure the section is the format "Section 1 (2024)"`});
            return `We could not find the professor of the ${courseName} course ${sectionName}.\n Please make sure the course name and the section are exactly correct since the chatbot is case sensitive. For example, "Introduction to Phonetics" and "introductiontophonetic" are not the same and make sure the section is the format "Section 1 (2024)"`;
        }else{
            // res.status(200).json({message: `The professor ${contact[0].fullname}'s contact information is as follow\n\n  phone: ${contact[0].phone}\n  email:${contact[0].email}`});
            return `The professor ${contact[0].fullname}'s contact information is as follow.\n\n  phone: ${contact[0].phone}\n  email:${contact[0].email}`;
        }
    }
    catch(error){
        console.error("Error fetching professor contact: " + error);
        // res.status(500).json({error: `Failed to fetch professor contact`});
        return "Internal Server Error";
    }
}