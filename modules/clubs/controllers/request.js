import prisma from "../../../core/db/prismaInstance.js";

export const requestToJoinClub = async (req, res) => {
    const { clubId } = req.params;
    const studentId = req.user ? req.user.id : "STU00027"; // Replace hardcoded ID with req.user.id once authentication is implemented
    console.log(
      "Request to join club with ID:",
      clubId,
      "by student:",
      studentId
    );
  
    try {
      const existingMember = await prisma.club_member.findFirst({
        where: { club_id: Number(clubId), student_id: studentId },
      });
  
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: "Already a member or pending request",
        });
      }
  
      await prisma.club_member.create({
        data: {
          club_id: Number(clubId),
          student_id: studentId,
          is_admin: false,
          status: "Pending",
        },
      });
  
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { firstname: true, lastname: true },
      });
  
      const club = await prisma.club.findUnique({
        where: { id: Number(clubId) },
        select: { name: true, owner_id: true },
      });
  
      if (!student || !club) {
        return res
          .status(400)
          .json({ success: false, message: "Student or club not found" });
      }
  
      const adminId = club.owner_id;
      const studentName = `${student.firstname} ${student.lastname}`;
      const clubName = club.name;
  
      await prisma.club_notification.create({
        data: {
          recipient_id: adminId,
          sender_id: studentId,
          club_id: Number(clubId),
          type: "Join Request",
          message: `${studentName} sent a request to join the club ${clubName}`,
          is_read: false,
        },
      });
  
      return res
        .status(200)
        .json({ success: true, message: "Join request sent" });
    } catch (error) {
      console.error("Error requesting to join club:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to request join",
        error: error.message,
      });
    }
  };
  
  // Fetch all pending requests for a specific club
  export const getPendingRequests = async (req, res) => {
    const { clubId } = req.params;
    try {
      const pendingRequests = await prisma.club_member.findMany({
        where: {
          club_id: Number(clubId),
          status: "Pending",
          is_admin: false,
        },
        select: {
          id: true,
          student: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });
  
      return res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch pending requests" });
    }
  };
  
  export const updateJoinRequestStatus = async (req, res) => {
    const { clubId, memberId } = req.params;
    const { status } = req.body;
  
    // Validate the provided status to ensure it's either Pending, Accepted, or Rejected
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }
  
    try {
      // Find the member's record based on club ID and member ID
      const member = await prisma.club_member.findFirst({
        where: {
          club_id: Number(clubId),
          id: Number(memberId),
        },
        include: {
          student: true,  // Including student info to access the sender's data
        },
      });
  
      if (!member) {
        return res.status(404).json({ success: false, message: "Club member not found" });
      }
  
      // Update the member's status
      const updatedMember = await prisma.club_member.update({
        where: {
          id: member.id,
        },
        data: {
          status: status,
        },
      });
  
      // Check if the sender exists and get the sender's ID
      const senderId = member.student ? member.student.id : null;
  
      if (!senderId) {
        return res.status(400).json({ success: false, message: "Sender not found" });
      }
  
      // Create notification for the request's status update
      await prisma.club_notification.create({
        data: {
          recipient_id: senderId,  // Notification goes to the member who made the request
          sender_id: senderId,  // Sender is the student who made the original request
          club_id: Number(clubId),
          type: status === "Accepted" ? "Request Accepted" : "Request Rejected",
          message: `Your request to join the club has been ${status.toLowerCase()}.`,
          is_read: false,
        },
      });
  
      // Optionally, delete the member if the request was declined
      if (status === "Rejected") {
        await prisma.club_member.delete({
          where: {
            id: member.id,
          },
        });
      }
  
      return res.status(200).json({
        success: true,
        message: `Join request status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating join request status:", error);
      return res.status(500).json({ success: false, message: "Failed to update join request status" });
    }
  };