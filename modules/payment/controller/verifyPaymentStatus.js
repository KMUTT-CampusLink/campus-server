// verifyPaymentStatus.js
import prisma from '../../../core/db/prismaInstance.js';
import dayjs from 'dayjs';

const verifyPaymentStatus = async (req, res) => {
  const { invoiceId } = req.params; // รับค่า invoiceId จาก URL parameter

  try {
    // ค้นหา Invoice จากฐานข้อมูลโดยใช้ invoiceId
    let invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId, // Prisma จะจัดการการ cast ประเภทให้ถูกต้อง
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const now = dayjs();

    // ตรวจสอบว่าเลย due_date แล้วและยังเป็น Unpaid หรือไม่
    if (dayjs(invoice.due_date).isBefore(now) && invoice.status === 'Unpaid') {
      // อัปเดตสถานะเป็น Cancelled หากเลย due_date และยังเป็น Unpaid
      invoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'Cancelled' },
      });
    }

    // หากสถานะเป็น Pay_by_Installments ให้ดึงข้อมูลการผ่อนจ่าย
    if (invoice.status === 'Pay_by_Installments') {
      const installments = await prisma.installment.findMany({
        where: {
          invoice_id: invoiceId,
        },
        orderBy: {
          due_date: 'asc',
        },
      });

      // ตรวจสอบการจ่ายบิลแรก
      if (installments.length > 0) {
        const firstInstallment = installments[0];
        if (dayjs(firstInstallment.due_date).isBefore(now) && firstInstallment.status === 'Unpaid') {
          // หากบิลแรกไม่ได้จ่ายในระยะเวลาที่กำหนด ให้ยกเลิก invoice หลักและบิลการผ่อนจ่ายทั้งหมด
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'Cancelled' },
          });

          await prisma.installment.updateMany({
            where: { invoice_id: invoiceId },
            data: { status: 'Cancelled' },
          });

          return res.status(200).json({ status: 'Cancelled', message: "Installment plan and main invoice have been cancelled due to non-payment of the first installment." });
        }
      }

      const installmentDetails = installments.map((installment) => ({
        amount: installment.amount,
        due_date: installment.due_date,
        status: installment.status,
      }));

      return res.status(200).json({
        status: invoice.status,
        number_of_installments: installments.length,
        installment_details: installmentDetails,
      });
    }

    // ส่งสถานะของ Invoice กลับไปยังผู้เรียก หากไม่ใช่การผ่อนจ่าย
    res.status(200).json({ status: invoice.status });
  } catch (error) {
    console.error("Error verifying payment status: ", error); // Log ข้อผิดพลาด
    res.status(500).json({ error: 'Error verifying payment status' });
  }
};

export { verifyPaymentStatus };