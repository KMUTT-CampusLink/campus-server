import prisma from '../../../../core/db/prismaInstance.js';
import dayjs from 'dayjs'; // ใช้ dayjs สำหรับการจัดการวันที่

export const installmentPreview = async (req, res) => {
  const { invoiceId, numInstallments } = req.params;

  try {
    // ตรวจสอบ invoiceId และ numInstallments เป็นตัวเลข
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

    const principalAmount = parseFloat(invoice.amount); // เงินต้น
    if (isNaN(principalAmount) || principalAmount <= 0) {
      return res.status(400).json({ message: "Invalid invoice amount" });
    }

    // คำนวณดอกเบี้ยรวม
    const interestRate = 0.05; // อัตราดอกเบี้ย 5% ต่อปี
    const dueDateLastInstallment = dayjs(invoice.due_date).add(parsedNumInstallments - 1, 'month');
    const totalMonths = dueDateLastInstallment.diff(dayjs(invoice.due_date), 'month');
    const totalYears = totalMonths / 12;

    const totalInterest = Math.round(principalAmount * interestRate * totalYears); // ดอกเบี้ยปัดเป็นจำนวนเต็ม
    const totalAmountWithInterest = principalAmount + totalInterest; // เงินต้นรวมดอกเบี้ย

    // คำนวณจำนวนเงินแต่ละงวด
    const installmentAmount = Math.floor(totalAmountWithInterest / parsedNumInstallments);
    const lastInstallmentAmount = totalAmountWithInterest - installmentAmount * (parsedNumInstallments - 1);

    // กำหนดวันที่ครบกำหนดแต่ละงวด
    let dueDate = dayjs(invoice.due_date);
    const installmentPreviewDetails = [];

    for (let i = 0; i < parsedNumInstallments; i++) {
      installmentPreviewDetails.push({
        amount: i === parsedNumInstallments - 1 ? lastInstallmentAmount : installmentAmount,
        due_date: dueDate.toDate(),
      });
      dueDate = dueDate.add(1, 'month');
    }

    // ตอบกลับผลลัพธ์
    res.status(200).json({
      interest_rate: interestRate,
      total_interest: totalInterest,
      installment_preview: installmentPreviewDetails,
    });
  } catch (error) {
    console.error("Error generating installment preview:", error);
    res.status(500).json({ error: "Error generating installment preview" });
  }
};