import prisma from "../../../core/db/prismaInstance.js";

const getAllComplaint = async (req, res) => {
  try {
    const complaints = await prisma.$queryRaw`
      SELECT 
        complaint.id,
        complaint.title,
        complaint.content,
        complaint.created_at AS createdAt,
        COALESCE(student.firstname, employee.firstname) AS userFirstName,
        COALESCE(student.lastname, employee.lastname) AS userLastName
      FROM complaint
      LEFT JOIN student ON complaint.user_id = student.user_id
      LEFT JOIN employee ON complaint.user_id = employee.user_id
      ORDER BY complaint.created_at DESC;
    `;

    res.json(complaints);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error fetching complaints' });
  }
};

export { getAllComplaint };
