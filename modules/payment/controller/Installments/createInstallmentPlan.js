import prisma from '../../../../core/db/prismaInstance.js';
import dayjs from 'dayjs'; // ใช้ dayjs สำหรับการจัดการวันที่

export const createInstallmentPlan = async (req, res) => {
  const { invoiceId, numInstallments } = req.params;

  try {
    // ตรวจสอบว่า numInstallments เป็นตัวเลขที่ถูกต้อง
    const parsedNumInstallments = parseInt(numInstallments, 10);
    if (isNaN(parsedNumInstallments) || parsedNumInstallments <= 0) {
      return res.status(400).json({ message: "Invalid number of installments" });
    }

    // ค้นหา Invoice จากฐานข้อมูล
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const principalAmount = parseFloat(invoice.amount);
    if (isNaN(principalAmount) || principalAmount <= 0) {
      return res.status(400).json({ message: "Invalid invoice amount" });
    }

    // อัปเดตสถานะของ invoice เป็น Pay_by_Installments
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Pay_by_Installments' },
    });

    // คำนวณวันที่ครบกำหนดของงวดสุดท้าย
    const dueDateLastInstallment = dayjs(invoice.due_date).add(parsedNumInstallments - 1, 'month');
    const totalMonths = dueDateLastInstallment.diff(dayjs(invoice.due_date), 'month');
    const totalYears = totalMonths / 12;

    // อัตราดอกเบี้ย 5% ต่อปี
    const interestRate = 0.05;

    // คำนวณดอกเบี้ยทั้งหมด (ปัดเป็นจำนวนเต็ม)
    const totalInterest = Math.round(principalAmount * interestRate * totalYears);

    // รวมดอกเบี้ยเข้าในยอดเงินต้น
    const totalAmountWithInterest = principalAmount + totalInterest;

    // คำนวณจำนวนเงินในการผ่อนแต่ละงวด
    const installmentAmount = Math.floor(totalAmountWithInterest / parsedNumInstallments);
    const lastInstallmentAmount = totalAmountWithInterest - installmentAmount * (parsedNumInstallments - 1);

    // กำหนดวันที่ครบกำหนดของแต่ละงวด
    let dueDate = dayjs(invoice.due_date);

    // สร้างข้อมูลการผ่อนชำระในตาราง installment
    for (let i = 0; i < parsedNumInstallments; i++) {
      await prisma.installment.create({
        data: {
          invoice_id: invoiceId,
          amount: i === parsedNumInstallments - 1 ? lastInstallmentAmount : installmentAmount,
          due_date: dueDate.toDate(),
        },
      });
      dueDate = dueDate.add(1, 'month'); // เลื่อนไปงวดถัดไป
    }

    res.status(201).json({ message: "Installment plan created successfully" });
  } catch (error) {
    console.error("Error creating installment plan:", error);
    res.status(500).json({ error: "Error creating installment plan" });
  }
};