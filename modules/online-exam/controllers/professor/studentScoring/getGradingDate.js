import prisma from "../../../../../core/db/prismaInstance.js";

export default async function getGradingDate(req, res) {
    const sectionid = parseInt(req.query.sectionid);
    try {
        const semesterEndDate = await prisma.$queryRaw`
        SELECT end_date, grade_announce_status
        FROM semester AS sem, section AS sec
        WHERE sem.id = sec.semester_id AND sec.id = ${sectionid}`;

        if (semesterEndDate.length > 0) {
            const endDate = new Date(semesterEndDate[0].end_date);
            const gradingDate = new Date(endDate);
            gradingDate.setDate(endDate.getDate() + 15);

            return res.json( {
                gradingDate: gradingDate, 
                semesterEndDate:semesterEndDate[0].end_date,
                gradeAnnounceStatus: semesterEndDate[0].grade_announce_status}
             );
        } else {
            return res.status(404).json({ message: "Section not found or no end date available" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
