import prisma from '../../../core/db/prismaInstance.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY ?? ""); // ตรวจสอบว่าใช้ STRIPE_KEY ที่ถูกต้องใน .env

const connectPaymentGateway = async (req, res) => {
  try {
    const { inv } = req.body; // รับค่า inv id จาก URL parameter

    // ดึงข้อมูลใบแจ้งหนี้จากฐานข้อมูลโดยใช้ inv id
    const invoice = await prisma.invoice.findUnique({
      where: { id: inv.toString() }, // แปลง inv เป็น string ถ้าจำเป็น
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // สร้าง Checkout Session โดยใช้ข้อมูลใบแจ้งหนี้
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'], // รองรับการชำระเงินผ่านบัตรและ PromptPay
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `Payment for Invoice #${invoice.id}`, // ชื่อสินค้า
            },
            unit_amount: Math.round(invoice.amount * 100), // แปลงบาทเป็นสตางค์ (เช่น 500 บาท = 50000 สตางค์)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`, // URL ที่จะเปลี่ยนไปเมื่อชำระเงินสำเร็จ
      cancel_url: `${process.env.CLIENT_URL}/checkout-cancel`, // URL เมื่อผู้ใช้ยกเลิกการชำระเงิน
      metadata: {
        invoice_id: invoice.id,
        customer_id: invoice.customer_id,
      },
    });

    // ส่ง URL ของ Checkout Session กลับไปยัง Frontend
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Error connecting to payment gateway:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { connectPaymentGateway };
