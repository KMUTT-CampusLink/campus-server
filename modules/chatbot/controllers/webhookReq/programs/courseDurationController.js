import prisma from "../../../../../core/db/prismaInstance.js";

export const courseDurationController = async(programName,degreeLevel)=>{
    try{
        const duration=await prisma.$queryRaw`
        SELECT name, duration,degree_level
            FROM "program"
            WHERE name = ${programName} and degree_level = ${degreeLevel}::education_level_enum;
        `;
        console.log(duration);
        if (!duration) {
            return `Sorry, we could not find any course duration information for the program "${programName}".`;
        }
        
        return `The duration for ${duration[0].name} (${duration[0].degree_level}) is ${duration[0].duration} years.`;
    }

    catch(error){
        console.error("Error fetching  course duration: " + error);
        return {error: "Failed to fetch course duration"};
    }
}