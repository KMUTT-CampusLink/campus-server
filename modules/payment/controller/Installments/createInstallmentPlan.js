import prisma from '../../../../core/db/prismaInstance.js';
import dayjs from 'dayjs'; // ใช้ dayjs สำหรับการจัดการวันที่

export const createInstallmentPlan = async (req, res) => {
  const { invoiceId, numInstallments } = req.params;

  try {
    // ค้นหา Invoice จากฐานข้อมูลโดยใช้ invoiceId
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // อัปเดตสถานะของ invoice เป็น Pay_by_Installments
    await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: 'Pay_by_Installments', // เปลี่ยนสถานะเป็น Pay_by_Installments
      },
    });

    // คำนวณจำนวนเงินในการผ่อนแต่ละงวด
    const totalAmount = invoice.amount;
    const installmentAmount = Math.ceil(totalAmount / numInstallments); // ปัดเศษขึ้นในใบแรก
    const lastInstallmentAmount = totalAmount - installmentAmount * (numInstallments - 1); // คำนวณใบสุดท้าย

    // กำหนดวันที่ครบกำหนดของแต่ละงวด
    let dueDate = dayjs(invoice.due_date);

    // สร้างข้อมูลการผ่อนชำระในตาราง installment
    for (let i = 0; i < numInstallments; i++) {
      await prisma.installment.create({
        data: {
          invoice_id: invoiceId,
          amount: i === numInstallments - 1 ? lastInstallmentAmount : installmentAmount,
          due_date: dueDate.toDate(),
        },
      });
      // เพิ่มวันที่ครบกำหนด 1 เดือนสำหรับงวดถัดไป
      dueDate = dueDate.add(1, 'month');
    }

    res.status(201).json({ message: "Installment plan created successfully" });
  } catch (error) {
    console.error("Error creating installment plan: ", error);
    res.status(500).json({ error: 'Error creating installment plan' });
  }
};
