import prisma from "../../../../../core/db/prismaInstance.js";

export const courseDurationController = async(programName, degreeLevel)=>{
    degreeLevel += " Degree";
    try{
        const duration=await prisma.$queryRaw`
        SELECT p.name , d.duration as program_duration, degree_level
            FROM "degree" as d,"program" as p
            WHERE p.id=d.program_id
            and p.name = ${programName} 
            and degree_level = ${degreeLevel}::education_level_enum;
             
        `;
        if (duration.length===0) {
            return `Sorry, we could not find any course duration information for the program "${programName}".`;
           // res.status(404).json({ message: `Sorry, we could not find any course duration information for the program "${programName}".`});
        }else{
             return `The duration for ${programName} (${degreeLevel}) is ${duration[0].program_duration} years.`;
            //  res.status(200).json({
            //      message: `The duration for ${programName} (${degreeLevel}) is ${duration[0].program_duration} years.`
            //  });
        }
        
    }

    catch(error){
        console.error("Error fetching  course duration: " + error);
        return {error: "Failed to fetch course duration"};
       // res.status(500).json({ error: "Failed to fetch course duration" });
    }
}