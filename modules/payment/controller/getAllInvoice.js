import prisma from '../../../core/db/prismaInstance.js';
import dayjs from 'dayjs';
import { decodeToken } from '../middlewares/jwt.js';


const getAllInvoice = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = decodeToken(token);
    const id = decoded.id; 
    console.log(id);
    //ตรวจสอบว่ามีการส่งค่า id มาหรือไม่
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // ดึงข้อมูล invoice โดยใช้ user_id ที่ได้รับจาก query
    const showAllInvoice = await prisma.invoice.findMany({
      where: {
        user_id: id,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // ตรวจสอบว่าเลย due_date แล้วและยังเป็น Unpaid หรือไม่
    const now = dayjs();
    for (const invoice of showAllInvoice) {
      if (dayjs(invoice.due_date).isBefore(now) && invoice.status === 'Unpaid') {
        // อัปเดตสถานะเป็น Cancelled หากเลย due_date และยังเป็น Unpaid
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'Cancelled' },
        });
      }
    }

    // ดึงข้อมูลอีกครั้งเพื่อแสดงสถานะที่อัปเดตแล้ว
    const updatedInvoices = await prisma.invoice.findMany({
      where: {
        user_id: id,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (updatedInvoices.length === 0) {
      return res.status(404).json({ message: "No invoices found for this user" });
    }

    res.json(updatedInvoices);
  } catch (error) {
    console.error("Error fetching Invoice Data: ", error); // Log ข้อผิดพลาด
    res.status(500).json({ error: 'Error fetching Invoice Data' });
  }
};

export { getAllInvoice };