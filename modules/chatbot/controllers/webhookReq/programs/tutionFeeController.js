import prisma from "../../../../../core/db/prismaInstance.js";

export const tutionFeeController = async(req, res)=>{
    const { programName, degreeLevel } = req.query;
    try{
        const tutionfee = await prisma.$queryRaw`
        SELECT p.name as ProgramName, p.price, d.degree_level
            FROM "program" AS p ,"degree" AS d
            WHERE 
            p.id=d.program_id
            AND p.name = ${programName} 
            AND d.degree_level =  ${degreeLevel}::education_level_enum;
        `;
        if (tutionfee.length === 0) {
            res.status(404).json({ message: `Sorry, we could not find any information for the program ${programName}.` });
           // return `Sorry, we could not find any information for the program ${programName}.`;
        }
        console.log(tutionfee);
        //return `You can study ${tutionfee[0].name} program. The tuition fee for ${tutionfee[0].name} (${tutionfee[0].degree_level}) is $${tutionfee[0].price}.`;
        res.status(200).json({
            message: `You can study the ${tutionfee[0].programname} program. The tuition fee for ${tutionfee[0].programname} (${tutionfee[0].degree_level}) is $${tutionfee[0].price}.`
        });
    }

    catch(error){
        console.error("Error fetching tuition fee: " + error);
      //  return {error: "Failed to fetch tuition fee"};
      res.status(500).json({ error: "Failed to fetch tuition fee" });
    }
}