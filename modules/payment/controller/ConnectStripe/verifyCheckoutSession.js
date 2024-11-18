import Stripe from 'stripe';
import prisma from '../../../../core/db/prismaInstance.js';
const stripe = new Stripe(process.env.STRIPE_KEY);

const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.query;

    // ดึงข้อมูล Checkout Session จาก Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // ตรวจสอบสถานะการชำระเงิน
    if (session.payment_status === 'paid') {
      // ตรวจสอบ metadata เพื่อดูว่าเป็น invoice หรือ installment
      if (session.metadata.invoice_id) {
        // อัปเดตสถานะของ Invoice ในฐานข้อมูลให้เป็น "ชำระเงินแล้ว"
        await prisma.invoice.update({
          where: { id: session.metadata.invoice_id },
          data: { status: 'Paid', paid_date: new Date() }, // เปลี่ยนสถานะเป็น 'Paid' หรือสถานะที่คุณต้องการ
        });
      } else if (session.metadata.installment_id) {
        // อัปเดตสถานะของ Installment ในฐานข้อมูลให้เป็น "ชำระเงินแล้ว"
        await prisma.installment.update({
          where: { id: session.metadata.installment_id },
          data: { status: 'Paid', paid_date: new Date() }, // เปลี่ยนสถานะเป็น 'Paid' หรือสถานะที่คุณต้องการ
        });
      }

      // ส่งข้อมูลการชำระเงินสำเร็จกลับไปยัง client
      return res.status(200).json({ status: 'succeeded', session });
    } else {
      return res.status(400).json({ status: 'incomplete', session });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { verifyCheckoutSession };
