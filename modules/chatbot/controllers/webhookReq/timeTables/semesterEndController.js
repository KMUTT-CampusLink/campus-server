import prisma from "../../../../../core/db/prismaInstance.js";

export const semesterEndController = async (req, res) => {
    const { name: semesterName } = req.query;  

    try {
        const semester = await prisma.$queryRaw`
            SELECT name,end_date
            FROM "semester"
            WHERE name = ${semesterName};
        `;

        if (!semester) {
            return `Sorry, we could not find any information for the semester "${semesterName}".`;
        }

        return `The end date for the semester ${semester[0].name} is ${semester[0].end_date}.`;
    } catch (error) {
        console.error("Error fetching semester end date: " + error);
        return "Failed to fetch semester end date";
    }
};
