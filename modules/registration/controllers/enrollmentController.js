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
      return res.status(200).json([]);
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
    // Fetch the course code for the section the student is trying to enroll in
    const section = await prisma.$queryRaw`
      SELECT course_code FROM section WHERE id = ${Number(section_id)};
    `;
    if (section.length === 0) {
      return res.status(404).json({ message: "Section not found." });
    }
    const { course_code } = section[0];

    // Check if the student is already enrolled in any section for this course
    const existingEnrollmentForCourse = await prisma.$queryRaw`
      SELECT * FROM enrollment_detail ed
      JOIN section s ON ed.section_id = s.id
      WHERE ed.student_id = ${student_id} AND s.course_code = ${course_code};
    `;

    if (existingEnrollmentForCourse.length > 0) {
      return res.status(409).json({
        message: "You are already enrolled in a section for this course.",
      });
    }

    // Check if the exact enrollment already exists
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
    return res
      .status(400)
      .json({ message: "Enrollment detail ID is required." });
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

export const getOrCreateEnrollmentHead = async (req, res) => {
  const { studentId, currentSemesterId } = req.body;

  if (!studentId || !currentSemesterId) {
    return res.status(400).json({
      message: "Both studentId and currentSemesterId are required.",
    });
  }

  try {
    // Check if enrollment_head record exists for the given student and semester
    const existingHead = await prisma.$queryRaw`
      SELECT id FROM enrollment_head
      WHERE student_id = ${studentId}
      AND semester_id = ${Number(currentSemesterId)};`;

    // If the record exists, return the head_id
    if (existingHead.length > 0) {
      return res
        .status(200)
        .json({ head_id: existingHead[0].id, message: "enroll head found" });
    }

    // If not, create a new enrollment_head record
    const newHead = await prisma.$queryRaw`
      INSERT INTO enrollment_head (student_id, semester_id, status, created_at, updated_at)
      VALUES (${studentId}, ${Number(
      currentSemesterId
    )}, 'Unpaid', NOW(), NOW())
      RETURNING id;`;

    // Return the new head_id
    return res
      .status(201)
      .json({ head_id: newHead[0].id, message: "enroll head created" });
  } catch (error) {
    console.error("Error fetching or creating enrollment head:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch or create enrollment head." });
  }
};

export const getPaymentStatus = async (req, res) => {
  const { headId } = req.params;

  if (!headId) {
    return res.status(400).json({
      message: "HeadId is required.",
    });
  }

  try {
    const enrollment = await prisma.$queryRaw`
      SELECT status FROM enrollment_head
      WHERE id = ${Number(headId)};`;

    if (!enrollment.length) {
      return res.status(200).json([]);
    }
    return res.status(200).json(enrollment[0].status);
  } catch (error) {
    console.error("Error fetching enrollment status:", error);
    return res.status(500).json({
      message: "Failed to fetch enrollment status.",
    });
  }
};
