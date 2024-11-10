import prisma from "../../../core/db/prismaInstance.js";

export const studentInfoController = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await prisma.$queryRaw`
      SELECT 
        s.id AS studentId,
        s.firstname AS firstName,
        s.lastname AS lastName,
        p.name AS programName,
        p.price AS programPrice,
        f.name AS facultyName
      FROM 
        student s
      JOIN 
        program_batch pb ON s.program_batch_id = pb.id
      JOIN 
        degree d ON pb.degree_id = d.id
      JOIN 
        program p ON d.program_id = p.id
      JOIN 
        faculty f ON p.faculty_id = f.id
      WHERE 
        s.id = ${studentId};
    `;

    if (result.length === 0) {
      return res.status(200).json([]);
    }

    const student = result[0];
    res.json(student);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}

export const studentProfileController = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await prisma.$queryRaw`
      SELECT 
        personal_email,
        firstname,
        midname,
        lastname,
        phone,
        address,
        date_of_birth,
        identification_no,
        degree_level
      FROM 
        student s
      JOIN 
        program_batch pb ON s.program_batch_id = pb.id
      JOIN 
        degree d ON pb.degree_id = d.id
      JOIN 
        program p ON d.program_id = p.id
      JOIN 
        faculty f ON p.faculty_id = f.id
      JOIN
        "user" u ON u.id = s.user_id
      WHERE 
        s.id = ${studentId};
    `;

    if (result.length === 0) {
      return res.status(200).json([]);
    }

    const student = result[0];
    res.json(student);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}
