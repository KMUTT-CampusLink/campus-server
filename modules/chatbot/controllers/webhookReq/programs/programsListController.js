import prisma from "../../../../../core/db/prismaInstance.js";

export const programsListController = async(req,res) => {
    try{
        const programs = await prisma.$queryRaw`
            SELECT p.name, degree_level
            FROM "program"as p,"degree" as d
            Where p.id=d.program_id
        `
        let fulfillment = "Our university offers the following programs. \n";
        programs.map((program, index) => {
            fulfillment += `${index + 1}. ${program.name} (${program.degree_level}) \n`;
        })
       // return fulfillment;
       res.status(200).json({fulfillment});
    }
    catch(error){
        console.error("Error fetching programs: " + error);
       // return {error: "Failed to fetch programs"};
       res.status(500).json({ error: "Failed to fetch program lists" });
    }
}