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
        student: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstname: true,
            midname: true,
            lastname: true,
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

    const formattedClubs = clubs.map((entry) => ({
      clubId: entry.club.id,
      clubName: entry.club.name,
      clubDescription: entry.club.description,
      memberType: entry.student ? "student" : "employee",
      isAdmin: entry.is_admin,
    }));

    res.json({ name, phoneNumber, lineID, joinedClubs: formattedClubs });
  } catch (error) {
    console.error("Error fetching clubs for member:", error); // Log error for inspection
    res.status(500).json({ error: "Failed to fetch clubs for the member" });
  }
};

// export const updateLineID = async (req, res) => {
//   const { memberId } = req.params;
//   const { lineID } = req.body;

//   // Validate lineID input
//   if (!lineID || lineID.trim() === "") {
//     console.log("Validation failed: Line ID cannot be empty.");
//     return res.status(400).json({ message: "Line ID cannot be empty." });
//   }

//   try {
//     // Log the search criteria
//     console.log("Searching for member with student_id or employee_id:", memberId);

//     // Look for a club_member entry with either student_id or employee_id matching memberId
//     const existingMember = await prisma.club_member.findFirst({
//       where: {
//         OR: [{ student_id: memberId }, { employee_id: memberId }],
//       },
//     });

//     // Log the result of the search
//     if (!existingMember) {
//       console.log("Member not found with ID:", memberId);
//       return res.status(404).json({ message: "Member not found." });
//     }

//     console.log("Found member:", existingMember);

//     // Update the line_id if the member exists
//     const updatedMember = await prisma.club_member.updateMany({
//       where: { id: existingMember.id },
//       data: { line_id: lineID },
//     });

//     console.log("Line ID updated successfully for member:", updatedMember);
//     return res.json({ message: "Line ID updated successfully.", updatedMember });
//   } catch (error) {
//     console.error("Error updating line ID:", error);
//     return res.status(500).json({ error: "Failed to update line ID." });
//   }
// };

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
    console.log("Updating all instances of member with student_id or employee_id:", memberId);

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

    console.log("Line ID updated successfully for all matching members:", updatedMembers);
    return res.json({ message: "Line ID updated successfully for all matching members.", updatedMembers });
  } catch (error) {
    console.error("Error updating line ID:", error);
    return res.status(500).json({ error: "Failed to update line ID." });
  }
};
