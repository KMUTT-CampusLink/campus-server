import prisma from '../../../core/db/prismaInstance.js';
import dayjs from 'dayjs';

const getAllInvoice = async (req, res) => {
  try {
    const id = req.user.id; 
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
      } else if (invoice.status === 'Pay_by_Installments') {
        // ตรวจสอบการผ่อนชำระ
        const installments = await prisma.installment.findMany({
          where: {
            invoice_id: invoice.id,
          },
          orderBy: {
            due_date: 'asc',
          },
        });

        if (installments.length > 0) {
          const firstInstallment = installments[0];
          if (dayjs(firstInstallment.due_date).isBefore(now) && firstInstallment.status === 'Unpaid') {
            // ยกเลิก invoice หลักและการผ่อนชำระทั้งหมดหากบิลแรกไม่ได้จ่าย
            await prisma.invoice.update({
              where: { id: invoice.id },
              data: { status: 'Cancelled' },
            });
            await prisma.installment.updateMany({
              where: { invoice_id: invoice.id },
              data: { status: 'Cancelled' },
            });
          } else {
            // ตรวจสอบว่าทุกบิลถูกชำระแล้วหรือไม่
            const allPaid = installments.every(installment => installment.status === 'Paid');
            if (allPaid) {
              // อัปเดตสถานะ invoice เป็น Paid หากบิลผ่อนชำระทั้งหมดถูกชำระแล้ว
              await prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: 'Paid' },
              });
            }
          }
        }
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