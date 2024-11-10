import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

//Fetch all students for creating a club
export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        //image: true
      },
    });
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("Failed to fetch students: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch students" });
  }
};

//Fetch professors for creating a club
export const getAllProfessors = async (req, res) => {
  try {
    const professors = await prisma.employee.findMany({
      where: {
        job_title: "Professor",
      },
      select: {
        id: true,
        firstname: true,
        midname: true,
        lastname: true,
      },
    });
    res.status(200).json({ success: true, data: professors });
  } catch (error) {
    console.error("Failed to fetch professors: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch professors" });
  }
};

export const getStudentbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch student" });
  }
};

// Fetch all clubs for landing page
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        club_img: true,
      },
    });
    return res.status(200).json({ success: true, data: clubs });
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch clubs" });
  }
};

export const getClubbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const club = await prisma.club.findUnique({
      where: { id: Number(id) },
      include: {
        student: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        club_member: true,
        building: true,
      },
    });
    return res.status(200).json({ success: true, data: club });
  } catch (error) {
    console.error("Failed to fetch club:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch club" });
  }
};

// Create a new club
export const createClub = async (req, res) => {
  const name = req.body.clubName;
  const description = req.body.clubDescription;
  const content = req.body.clubDetails;
  const owner_id = "STU00023";
  const members = req.body.members;
  const building_id = req.body.buildingId;

  console.log(name);
  console.log(description);
  console.log(content);
  console.log(owner_id);
  console.log(members);
  console.log(building_id);

  const club_img = req.file
    ? req.file.filename
    : "https://img.freepik.com/premium-vector/badminton-vintage-logo-design-perfect-team-badminton-club-badminton-championship_297778-707.jpg"; // Get the uploaded file's name

  // Validate required fields
  if (!name || !owner_id) {
    return res
      .status(400)
      .json({ success: false, message: "Name and Owner ID are required" });
  }

  try {
    const existingClub = await prisma.club.findUnique({
      where: {
        name,
      },
    });

    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: "A club with this name already exists.",
      });
    }

    // Create the new club with the uploaded image
    const newClub = await prisma.club.create({
      data: {
        name: name,
        description: description,
        content: content,
        club_img: club_img,
        owner_id: owner_id, // Links to the 'student' model
        building_id: parseInt(building_id),
      },
    });
    console.log("New club created:", newClub);
    // Prase the members array as it is sent as a string
    const addedMembers = JSON.parse(members);
    // Optionally, add the owner as a club member with admin rights
    if (owner_id.startsWith("STU")) {
      await prisma.club_member.create({
        data: {
          club_id: newClub.id,
          student_id: owner_id,
          is_admin: true,
          status: "Accepted",
        },
      });
    } else if (owner_id.startsWith("EMP")) {
      await prisma.club_member.create({
        data: {
          club_id: newClub.id,
          professor_id: owner_id,
          is_admin: true,
          status: "Accepted",
        },
      });
    } else {
      console.warn(`Unrecognized owner ID format: ${owner_id}`);
    }
    console.log("Added club owner as memeber.");

    for (const memberId of addedMembers) {
      console.log(`Adding member: ${memberId}`);
      if (memberId.startsWith("STU")) {
        await prisma.club_member.create({
          data: {
            club_id: newClub.id,
            student_id: memberId,
            is_admin: false,
            status: "Accepted",
          },
        });
      } else if (memberId.startsWith("EMP")) {
        await prisma.club_member.create({
          data: {
            club_id: newClub.id,
            employee_id: memberId,
            is_admin: false,
            status: "Accepted",
          },
        });
      } else {
        console.warn(`Unrecognized member ID format: ${memberId}`);
      }
    }
    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: newClub,
    });
  } catch (error) {
    console.error("Error creating club:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the club.",
    });
  }
};

// Update description of a club
export const updateClubDescription = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { content } = req.body;

  try {
    const updatedClub = await prisma.club.update({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
        content: content,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Club description updated.",
      data: updatedClub,
    });
  } catch (error) {
    console.error("Error updating club description:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the club description.",
    });
  }
};