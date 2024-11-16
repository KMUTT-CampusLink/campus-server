// installmentPreview.js
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

    // คำนวณจำนวนเงินในการผ่อนแต่ละงวด
    const totalAmount = invoice.amount;
    const installmentAmount = Math.ceil(totalAmount / numInstallments); // ปัดเศษขึ้นในใบแรก
    const lastInstallmentAmount = totalAmount - installmentAmount * (numInstallments - 1); // คำนวณใบสุดท้าย

    // กำหนดวันที่ครบกำหนดของแต่ละงวด
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

    res.status(200).json({ installment_preview: installmentPreviewDetails });
  } catch (error) {
    console.error("Error generating installment preview: ", error);
    res.status(500).json({ error: 'Error generating installment preview' });
  }
};
