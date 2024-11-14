import prisma from "../../../core/db/prismaInstance.js";

export const requestToJoinClub = async (req, res) => {
    const { clubId } = req.params;
    const memberId = req.user ? req.user.id : "EMP00027"; // Replace hardcoded ID with req.user.id once authentication is implemented
    const isStudent = memberId.startsWith("STU");
    console.log("Request to join club with ID:", clubId, "by user:", memberId);
  
    try {
      
      const existingMember = await prisma.club_member.findFirst({
        where: isStudent 
        ? { club_id: Number(clubId), student_id: memberId } 
        : { club_id: Number(clubId), employee_id: memberId },
      });

      console.log("isStudent:", isStudent);
      console.log("existingMember:", memberId);
  
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: "Already a member or pending request",
        });
      }
  
      await prisma.club_member.create({
        data: {
          club_id: Number(clubId),
          [isStudent ? 'student_id' : 'employee_id']: memberId,
          is_admin: false,
          status: "Pending",
        },
      });
      console.log("Member created successfully");
  
      const user = isStudent
        ? await prisma.student.findUnique({where: { id: memberId}, select: { firstname: true, midname: true, lastname: true }})
        : await prisma.employee.findUnique({where: { id: memberId}, select: { firstname: true, midname: true, lastname: true }});
      
      const club = await prisma.club.findUnique({
        where: { id: Number(clubId) },
        select: { name: true, owner_id: true },
      });
  
      if (!user || !club) {
        return res
          .status(400)
          .json({ success: false, message: "Member or club not found" });
      }
  
      const adminId = club.owner_id;
      const adminIsStudent = adminId.startsWith("STU");
      const memberName = isStudent 
      ? `${user.firstname || ""} ${user.midname || ""} ${user.lastname || ""}` 
      : `Prof. ${user.firstname || ""} ${user.midname || ""} ${user.lastname || ""}`;
      const clubName = club.name;
      
      // Check that sender_id exists before creating notification
    const senderExists = isStudent
    ? await prisma.student.findUnique({ where: { id: memberId } })
    : await prisma.employee.findUnique({ where: { id: memberId } });

  if (!senderExists) {
    return res.status(400).json({ success: false, message: "Sender not found in database" });
  }
      const notificationData = {
        club_id: Number(clubId),
        type: "Join Request",
        message: `${memberName} sent a request to join the club ${clubName}`,
        is_read: false,
        ...(isStudent ? { stu_sender: memberId } : { emp_sender: memberId }),
        ...(adminIsStudent ? { stu_recipient: adminId } : { emp_recipient: adminId }),
      };
        await prisma.club_notification.create({ data: notificationData });
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
          employee: true,
        },
      });
  
      if (!member) {
        return res.status(404).json({ success: false, message: "Club member not found" });
      }

      const club = await prisma.club.findUnique({
        where: { id: Number(clubId) },
        select: { owner_id: true },
      });

      if (!club || !club.owner_id) {
        return res.status(404).json({ success: false, message: "Club admin not found" });
      }

      const adminId = club.owner_id;
      const adminIsStudent = adminId.startsWith("STU");
  
      // Update the member's status
      // const updatedMember = await prisma.club_member.update({
      await prisma.club_member.update({
        where: {
          id: member.id,
        },
        data: {
          status: status,
        },
      });
  
      // Check if the sender exists and get the sender's ID
      const recipientId = member.student ? member.student.id : member.employee.id;
      const recipientIsStudent = !!member.student;
  
      // Create notification for the request's status update
      // await prisma.club_notification.create({
      //   data: {
      //     recipient_id: senderId,  // Notification goes to the member who made the request
      //     sender_id: senderId,  // Sender is the student who made the original request
      //     club_id: Number(clubId),
      //     type: status === "Accepted" ? "Request Accepted" : "Request Rejected",
      //     message: `Your request to join the club has been ${status.toLowerCase()}.`,
      //     is_read: false,
      //   },
      // });
      const notificationData = {
        club_id: Number(clubId),
        type: status === "Accepted" ? "Request Accepted" : "Request Rejected",
        message: `Your request to join the club has been ${status.toLowerCase()}.`,
        is_read: false,
        ...(recipientIsStudent ? { stu_recipient: recipientId } : { emp_recipient: recipientId }),
        ...(adminIsStudent ? { stu_sender: adminId } : { emp_sender: adminId }),
      };

        await prisma.club_notification.create({ data: notificationData });

  
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