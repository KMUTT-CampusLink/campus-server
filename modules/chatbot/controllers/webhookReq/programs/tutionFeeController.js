import prisma from "../../../../../core/db/prismaInstance.js";

export const tutionFeeController = async(programName, degreeLevel)=>{
    try{
        const tutionfee = await prisma.$queryRaw`
        SELECT name, price, degree_level
            FROM "program"
            WHERE name = ${programName} and degree_level = ${degreeLevel}::education_level_enum;
        `;
        if (!tutionfee) {
            return `Sorry, we could not find any tuition fee information for the program "${programName}".`;
        }
        
        return `The tuition fee for ${tutionfee[0].name} (${tutionfee[0].degree_level}) is $${tutionfee[0].price}.`;
    }

    catch(error){
        console.error("Error fetching tuition fee: " + error);
        return {error: "Failed to fetch tuition fee"};
    }
}