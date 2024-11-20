// getInvoiceInfo.js
import prisma from '../../../core/db/prismaInstance.js';

export const getInvoiceInfo = async (req, res) => {
  const { invoiceId } = req.params; // รับค่า invoiceId จาก URL parameter

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

     // หากเป็นการผ่อนชำระ ให้ดึงข้อมูลการผ่อนชำระด้วย
     let installmentDetails = [];
     let numberOfInstallments = 0;
     if (invoice.status === 'Pay_by_Installments') {
       installmentDetails = await prisma.installment.findMany({
         where: {
           invoice_id: invoiceId,
         },
         orderBy: {
           due_date: 'asc',
         },
       });
       numberOfInstallments = installmentDetails.length;
     }
 
     // ส่งข้อมูลใบแจ้งหนี้และการผ่อนชำระกลับไปยัง client
     res.status(200).json({
       invoice,
       number_of_installments: numberOfInstallments,
       installment_details: installmentDetails,
     });
   } catch (error) {
     console.error("Error fetching invoice information: ", error); // Log ข้อผิดพลาด
     res.status(500).json({ error: 'Error fetching invoice information' });
   }
 };
 