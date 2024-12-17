import prisma from "../../../../../core/db/prismaInstance.js";

export const semesterStartController = async (stuId) => {
    console.log(stuId);
    try {
        const semesterStartDate = await prisma.$queryRaw`
            SELECT start_date
            FROM "semester" as se, "student" as s
            WHERE s.id = ${stuId}
            AND s.semester_id = se.id;
        `;
        let date = (semesterStartDate[0].start_date + "").split(" 07");
        if (!semesterStartDate) {
            // res.status(500).json({error:`Sorry, we could not find any information for your semester.`});
            return `Sorry, we could not find any information for your semester.`;
        }
        // res.status(200).json({reply: `The start date for the semester is ${date[0]}.`} );
        return `The start date for your semester is ${date[0]}.`;
    } catch (error) {
        console.error("Error fetching semester start date: " + error);
        // res.status(500).json({ error: "Failed to fetch semester start date" });
        return "Failed to fetch the semester start date";
    }
};
