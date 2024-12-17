import prisma from "../../../core/db/prismaInstance.js";

export const getMemberByClubId = async (req, res) => {
  const { clubId } = req.params;

  try {
    const members = await prisma.club_member.findMany({
      where: {
        club_id: parseInt(clubId),
      },
      select: {
        club_id: true,
        line_id: true,
        student: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
            image: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
            image: true,
            faculty: {
              select: {
                name: true, // Fetch faculty (department) name
              },
            },
          },
        },
        is_admin: true,
        status: true,
      },
    });
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch members" });
  }
};

export const getClubByMemberId = async (req, res) => {
  const { memberId } = req.params;
  console.log("Received memberId:", memberId);

  try {
    // Ensure only existing fields are queried in `student` and `employee`
    const clubs = await prisma.club_member.findMany({
      where: {
        OR: [{ student_id: memberId }, { employee_id: memberId }],
      },
      include: {
        club: true, // Includes the club data
        student: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
            phone: true,
            image: true,
            //line_id: true,
            // Omit `address` or any non-existent fields here
          },
        },
        employee: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
            phone: true,
            image: true,
            //line_id: true,
            // Only include fields that exist in `employee`
          },
        },
      },
    });

    console.log("Fetched clubs:", clubs);

    if (!clubs || clubs.length === 0) {
      return res
        .status(404)
        .json({ message: "No clubs found for this member." });
    }

    const memberData = clubs[0].student || clubs[0].employee;
    const name = `${memberData.firstname} ${memberData.lastname}`;
    const phoneNumber = memberData.phone || "N/A";
    const lineID = clubs[0].line_id || "N/A";
    const profileImage = memberData.image;

    const formattedClubs = clubs.map((entry) => ({
      clubId: entry.club.id,
      clubName: entry.club.name,
      clubDescription: entry.club.description,
      memberType: entry.student ? "student" : "employee",
      isAdmin: entry.is_admin,
    }));
    res.json({
      name,
      phoneNumber,
      lineID,
      joinedClubs: formattedClubs,
      profileImage,
    });
  } catch (error) {
    console.error("Error fetching clubs for member:", error); // Log error for inspection
    res.status(500).json({ error: "Failed to fetch clubs for the member" });
  }
};

export const updateLineID = async (req, res) => {
  const { memberId } = req.params;
  const { lineID } = req.body;

  // Validate lineID input
  if (!lineID || lineID.trim() === "") {
    console.log("Validation failed: Line ID cannot be empty.");
    return res.status(400).json({ message: "Line ID cannot be empty." });
  }

  try {
    // Log the search criteria
    console.log(
      "Updating all instances of member with student_id or employee_id:",
      memberId
    );

    // Update line_id in all rows where student_id or employee_id matches memberId
    const updatedMembers = await prisma.club_member.updateMany({
      where: {
        OR: [{ student_id: memberId }, { employee_id: memberId }],
      },
      data: { line_id: lineID },
    });

    // Check if any rows were updated
    if (updatedMembers.count === 0) {
      console.log("No matching rows found for ID:", memberId);
      return res.status(404).json({ message: "Member not found." });
    }

    console.log(
      "Line ID updated successfully for all matching members:",
      updatedMembers
    );
    return res.json({
      message: "Line ID updated successfully for all matching members.",
      updatedMembers,
    });
  } catch (error) {
    console.error("Error updating line ID:", error);
    return res.status(500).json({ error: "Failed to update line ID." });
  }
};

export const getMembershipStatus = async (req, res) => {
  const { clubId } = req.params;
  const { id, studentId, empId } = req.user;
  //const { empId } = req.user.empId;
  console.log("User ID:", id);
  console.log("Student ID:", studentId);
  console.log("Employee ID:", empId);

  try {
    // Determine membership status using studentId or empId
    const membership = await prisma.club_member.findFirst({
      where: {
        club_id: parseInt(clubId),
        AND: [{ student_id: studentId }, { employee_id: empId }],
      },
      select: {
        is_admin: true,
        status: true,
        student_id: true,
        employee_id: true,
      },
    });

    if (!membership) {
      // User is not a member of the club
      return res.status(200).json({ isAdmin: false, isMember: false });
    }

    // Determine if the user is an admin or member
    const isAdmin = membership.is_admin;
    const isMember = membership.status === "Accepted";
    const memberId = membership.student_id || membership.employee_id;

    return res.status(200).json({ isAdmin, isMember, memberId });
  } catch (error) {
    console.error("Error fetching membership status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch membership status" });
  }
};
