import prisma from "../../../core/db/prismaInstance.js";

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
        sem.end_date
      FROM 
        enrollment_head eh
      LEFT JOIN 
        semester sem ON eh.semester_id = sem.id
      WHERE 
        eh.student_id = ${studentId}
        AND eh.status = 'Paid'
      ORDER BY 
        eh.semester_id;
    `;

    if (semesters.length === 0) {
      return res.status(404).json({ error: "Student data not found" });
    }
    semesters.pop();

    res.json(semesters);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
};

export const addEnrollmentDetail = async (req, res) => {
  const { head_id, student_id, section_id } = req.body;

  if (!head_id || !student_id || !section_id) {
    return res
      .status(400)
      .json({ message: "head_id, student_id, and section_id are required." });
  }

  try {
    const existingEnrollment = await prisma.$queryRaw`
    SELECT * FROM enrollment_detail 
    WHERE head_id = ${Number(
      head_id
    )} AND student_id = ${student_id} AND section_id = ${Number(section_id)};`;

    if (existingEnrollment.length > 0) {
      return res.status(409).json({
        message:
          "Enrollment already exists with the given head_id, student_id, and section_id.",
      });
    }

    const enrollmentDetail = await prisma.$transaction(async (prisma) => {
      // Insert into enrollment_detail table
      const newEnrollment = await prisma.$queryRaw`
        INSERT INTO enrollment_detail (head_id, student_id, section_id, created_at, updated_at)
        VALUES (${Number(head_id)}, ${student_id}, ${Number(
        section_id
      )}, NOW(), NOW())
        RETURNING *;
      `;

      // Update seats left in the sections table
      await prisma.$queryRaw`
        UPDATE section
        SET seat_left = seat_left - 1
        WHERE id = ${Number(section_id)} AND seat_left > 0;
      `;

      return newEnrollment;
    });

    return res.status(201).json(enrollmentDetail);
  } catch (error) {
    console.error("Error creating enrollment detail:", error);
    return res
      .status(500)
      .json({ message: "Error creating enrollment detail." });
  }
};

export const deleteEnrollmentDetail = async (req, res) => {
  const { selectedEnrollmentId } = req.params;

  if (!selectedEnrollmentId) {
    return res.status(400).json({ message: "Enrollment detail ID is required." });
  }

  try {
    // Fetch the enrollment detail to get the student ID and check if it exists
    const existingEnrollment = await prisma.$queryRaw`
    SELECT * FROM enrollment_detail 
    WHERE id = ${Number(selectedEnrollmentId)};`;

    if (existingEnrollment.length === 0) {
      return res.status(404).json({
        message: "Enrollment not found with the given enrollment detail ID.",
      });
    }

    const { student_id } = existingEnrollment[0];

    // Check how many active enrollments the student has
    const studentEnrollments = await prisma.$queryRaw`
      SELECT * FROM enrollment_detail 
      WHERE student_id = ${student_id} AND status='Active';`;

    if (studentEnrollments.length === 1) {
      return res.status(400).json({
        message: "Cannot delete the last remaining section for the student.",
      });
    }

    // Proceed to delete the enrollment detail if the student has more than one section
    await prisma.$executeRaw`
    DELETE FROM enrollment_detail 
    WHERE id = ${Number(selectedEnrollmentId)}; 
    `;

    return res
      .status(200)
      .json({ message: "Enrollment successfully deleted." });
  } catch (error) {
    console.error("Error deleting enrollment detail:", error);
    return res
      .status(500)
      .json({ message: "Error deleting enrollment detail." });
  }
};
