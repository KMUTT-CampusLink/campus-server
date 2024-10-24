import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode"; //npm i qrcode

const prisma = new PrismaClient();

const generateQrCode = async (req, res) => {
  const { sectionId, professorId } = req.body;
    
  // Check incoming request data
  console.log("Received data:", req.body);

  try {
    const availableAt = new Date();
    const expiredAt = new Date(availableAt.getTime() + 15 * 60 * 1000); // QR expires in 15 minutes

    const qrData = JSON.stringify({
      sectionId,
      professorId,
      availableAt,
      expiredAt,
    });
    
    const qrCode = await QRCode.toDataURL(qrData); // Generate QR code as Base64

    const newQrCode = await prisma.attendance_qr_code.create({
      data: {
        section_id: sectionId, // Ensure these fields match your Prisma schema
        professor_id: professorId,
        qrcode: qrCode,
        //location,
        start_at: availableAt,
        end_at: expiredAt,
        },
    });

    res.status(201).json({ qrCode: newQrCode.qrcode });
  } catch (error) {
    console.error("Error details:", error); // Detailed logging
    res.status(500).json({ message: "Error generating QR code", error: error.message });
  }
};

export default generateQrCode;