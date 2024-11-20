import prisma from "../../../../../core/db/prismaInstance.js";

export const semesterEndController = async (stuId) => {
    try {
        const semesterEndDate = await prisma.$queryRaw`
            SELECT end_date
            FROM "semester" as se , "student" as s
            WHERE s.id = ${stuId}
            AND s.semester_id = se.id;
        `;
        let date = (semesterEndDate[0].end_date + "").split(" 07");
        if (!semesterEndDate) {
            // res.status(500).json({error: `Sorry, we could not find any information for your semester.`})
            return `Sorry, we could not find any information for your semester.`;
        }
        // res.status(200).json({reply : `The end date for your semester is ${date[0]}.`})
        return `The end date for your semester is ${date[0]}.`;
    } catch (error) {
        console.error("Error fetching semester end date: " + error);
        // res.status(500).json({error: "Failed to fetch semester end date"})
        return "Failed to fetch semester end date";
    }
};
