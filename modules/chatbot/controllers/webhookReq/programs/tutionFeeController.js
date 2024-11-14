import prisma from "../../../../../core/db/prismaInstance.js";

export const tutionFeeController = async(programName, degreeLevel)=>{
    try{
        const tutionfee = await prisma.$queryRaw`
        SELECT p.name as ProgramName, p.price, d.degree_level
            FROM "program" AS p ,"degree" AS d
            WHERE 
            p.id = d.program_id
            AND p.name = ${programName} 
            AND d.degree_level =  ${degreeLevel}::education_level_enum;
        `;
        if (tutionfee.length === 0) {
            // res.status(404).json({ message: `Sorry, we could not find any information for the program ${programName}.` });
           return `Sorry, we could not find any information for the program ${programName}.`;
        }
        // res.status(200).json({
        //     message: `You can study the ${tutionfee[0].programname} program. The tuition fee for ${tutionfee[0].programname} (${tutionfee[0].degree_level}) is $${tutionfee[0].price}.`
        // });
        return `You can study ${tutionfee[0].programname} program. The tuition fee for ${tutionfee[0].programname} (${tutionfee[0].degree_level}) is $${tutionfee[0].price}.`;
    }

    catch(error){
        console.error("Error fetching tuition fee: " + error);
       return "Failed to fetch tuition fee";
    //   res.status(500).json({ error: "Failed to fetch tuition fee" });
    }
}