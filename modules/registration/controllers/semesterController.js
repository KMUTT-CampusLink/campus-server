import prisma from "../../../core/db/prismaInstance.js";

export const getAllSemesters = async (req, res) => {
    try {
        const semesters = await prisma.semester.findMany({
            orderBy: [
                { academic_year: 'asc' },
                { name: 'asc' }, //secondary sort by name
            ]
        });

        if (semesters.length === 0) {
            return res.status(200).json([]);
        }
        semesters.pop();

        res.json(semesters);
    } catch (error) {
        console.error("Error fetching semester data:", error);
        res.status(500).json({ error: "Failed to fetch semester data" });
    }
};

export const getSemesterByStudentId = async (req, res) => {
    const { studentId } = req.params;
    try {
        const semesters = await prisma.$queryRaw`
      SELECT 
        eh.id,
        eh.student_id,             
        eh.semester_id,
        sem.name AS semester_name,
        sem.start_date,
        sem.end_date,
        sem.academic_year
      FROM 
        enrollment_head eh
      LEFT JOIN 
        semester sem ON eh.semester_id = sem.id
      WHERE 
        eh.student_id = ${studentId}
      ORDER BY 
        sem.academic_year, sem.name;
    `;

        if (semesters.length === 0) {
            return res.status(200).json([]);
        }
        semesters.pop();

        res.json(semesters);
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ error: "Failed to fetch student data" });
    }
};

export const getPeriodBySemesterId = async (req, res) => {
    const { semesterId } = req.params;
    try {
        const periods = await prisma.$queryRaw`
      SELECT *
      FROM calendar
      WHERE semester_id = ${Number(semesterId)};
    `;

        if (periods.length === 0) {
            return res.status(200).json([]);
        }

        res.json(periods);
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ error: "Failed to fetch student data" });
    }
};