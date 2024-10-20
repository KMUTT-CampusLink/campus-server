import prisma from '../../../core/db/prismaInstance.js';

const getAllInvoice = async (req, res) => {
  try {
    const { id } = req.query; // รับค่า id จาก URL parameter
    console.log("Invoice ID: ", id); // Log ค่า id เพื่อช่วยตรวจสอบ

    // ตรวจสอบว่ามีการส่งค่า id มาหรือไม่
    if (!id) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    // ดึงข้อมูล invoice โดยใช้ user_id ที่ได้รับจาก query
    const showAllInvoice = await prisma.invoice.findMany({
      where: {
        user_id: id, // Prisma จะจัดการการ cast ประเภทให้ถูกต้อง
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (showAllInvoice.length === 0) {
      return res.status(404).json({ message: "No invoices found for this user" });
    }

    res.json(showAllInvoice);
  } catch (error) {
    console.error("Error fetching Invoice Data: ", error); // Log ข้อผิดพลาด
    res.status(500).json({ error: 'Error fetching Invoice Data' });
  }
};

export { getAllInvoice };
