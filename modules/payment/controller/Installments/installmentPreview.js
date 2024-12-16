import prisma from '../../../../core/db/prismaInstance.js';
import dayjs from 'dayjs'; // ใช้ dayjs สำหรับการจัดการวันที่

export const installmentPreview = async (req, res) => {
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

    // คำนวณวันที่ครบกำหนดของงวดสุดท้าย
    const dueDateLastInstallment = dayjs(invoice.due_date).add(numInstallments - 1, 'month');

    // คำนวณระยะเวลาการคิดดอกเบี้ย (เป็นปี)
    const totalMonths = dueDateLastInstallment.diff(dayjs(invoice.due_date), 'month');
    const totalYears = totalMonths / 12;

    // อัตราดอกเบี้ย 5% ต่อปี
    const interestRate = 0.05;

    // คำนวณดอกเบี้ยทั้งหมด (ปัดเป็นจำนวนเต็ม)
    const totalInterest = Math.round(invoice.amount * interestRate * totalYears);

    // รวมดอกเบี้ยเข้าในยอดเงินต้น
    const totalAmountWithInterest = invoice.amount + totalInterest;

    // คำนวณจำนวนเงินในการผ่อนแต่ละงวด
    const installmentAmount = Math.ceil(totalAmountWithInterest / numInstallments);
    const lastInstallmentAmount = totalAmountWithInterest - installmentAmount * (numInstallments - 1);

    // เตรียมวันที่ครบกำหนดของแต่ละงวด
    let dueDate = dayjs(invoice.due_date);

    // เตรียมข้อมูลการผ่อนชำระสำหรับพรีวิว
    const installmentPreviewDetails = [];
    for (let i = 0; i < numInstallments; i++) {
      installmentPreviewDetails.push({
        amount: i === numInstallments - 1 ? lastInstallmentAmount : installmentAmount,
        due_date: dueDate.toDate(),
      });
      // เพิ่มวันที่ครบกำหนด 1 เดือนสำหรับงวดถัดไป
      dueDate = dueDate.add(1, 'month');
    }

    res.status(200).json({
      interest_rate: interestRate,
      total_interest: totalInterest,
      installment_preview: installmentPreviewDetails,
    });
  } catch (error) {
    console.error("Error generating installment preview: ", error);
    res.status(500).json({ error: 'Error generating installment preview' });
  }
};
