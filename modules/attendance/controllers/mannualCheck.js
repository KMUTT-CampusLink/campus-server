import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode"; //npm i qrcode
const prisma = new PrismaClient();

const generateQrCode = async (req, res) => {
  const secId = parseInt(req.params.secId);
  const empId = req.user.employeeId;
  const professorId = await prisma.professor.findFirst({
    where: {
      id: empId,
    },
    select: {
      id: true,
    },
  })

  // TODO: get profesor token from client cookies
  
  try {
    // const expiredAt = new Date(availableAt.getTime() + 15 * 60 * 1000); // QR expires in 15 minutes
    const section = await prisma.section.findFirst({
      where: {
        id: secId,
      },
    });

    if (!section) {
      return res.status(400).json("Invalid Section Id");
    }

    const onGoing = await prisma.attendance.findFirst({
      where: {
        section_id: secId,
        professor_id: parseInt(professorId.id),
        end_at: {
          gt: new Date(),
        },
      },
    });

    if (onGoing !== null) {
      const qrCode = await QRCode.toDataURL(JSON.stringify({ id: onGoing.id }));
      return res.status(200).json({
        status: "Atteneance in progress",
        qrCode: qrCode,
      });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        section_id: secId, // Ensure these fields match your Prisma schema
        professor_id: parseInt(professorId.id),
        //location,
        start_at: new Date(),
        end_at: new Date(new Date().getTime() + 2 * 60 * 1000),
      },
    });

    const qrData = JSON.stringify({
      id: newAttendance.id,
    });

    const qrCode = await QRCode.toDataURL(qrData); // Generate QR code as Base64

    res.status(201).json({
      status: "New attendance created",
      qrCode: qrCode,
    });
  } catch (error) {
    console.error("Error details:", error); // Detailed logging
    res
      .status(500)
      .json({ message: "Error generating QR code", error: error.message });
  }
};

export default generateQrCode;
