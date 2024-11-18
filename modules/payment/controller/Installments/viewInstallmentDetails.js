// viewInstallmentDetails.js
import prisma from '../../../../core/db/prismaInstance.js';

const viewInstallmentDetails = async (req, res) => {
  const { invoiceId } = req.params; // รับค่า invoiceId จาก URL parameter

  try {
    // ค้นหาการผ่อนจ่ายของ Invoice โดยใช้ invoiceId
    const installments = await prisma.installment.findMany({
      where: {
        invoice_id: invoiceId,
      },
      orderBy: {
        due_date: 'asc',
      },
    });

    // ตรวจสอบว่ามีข้อมูลการผ่อนจ่ายหรือไม่
    if (installments.length === 0) {
      return res.status(404).json({ message: "This Invoice did not create installments plan yet" });
    }

    // เตรียมข้อมูลการผ่อนจ่าย
    const installmentDetails = installments.map((installment) => ({
      id: installment.id,
      amount: installment.amount,
      due_date: installment.due_date,
      status: installment.status,
    }));

    return res.status(200).json({
      number_of_installments: installments.length,
      installment_details: installmentDetails,
    });
  } catch (error) {
    console.error("Error fetching installment details: ", error); // Log ข้อผิดพลาด
    res.status(500).json({ error: 'Error fetching installment details' });
  }
};

export { viewInstallmentDetails };