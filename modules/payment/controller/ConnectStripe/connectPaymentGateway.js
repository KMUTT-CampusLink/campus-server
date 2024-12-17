import prisma from '../../../../core/db/prismaInstance.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { decodeToken } from '../../middlewares/jwt.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY ?? ""); // ตรวจสอบว่าใช้ STRIPE_KEY ที่ถูกต้องใน .env

const connectPaymentGateway = async (req, res) => {
  try {
    const { inv, ins, balance } = req.body; // รับค่า inv, ins, balance จาก req.body

    // ดึง User ID จาก Token
    const token = req.cookies.token;
    const decoded = decodeToken(token);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    let invoice;

    if (inv) {
      invoice = await prisma.invoice.findUnique({
        where: { id: inv.toString() },
      });

      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
    } else if (ins) {
      const installment = await prisma.installment.findUnique({
        where: { id: ins.toString() },
      });

      if (!installment) {
        return res.status(404).json({ error: "Installment not found" });
      }

      invoice = {
        id: installment.id,
        amount: installment.amount,
        customer_id: installment.customer_id,
      };
    } else {
      return res.status(400).json({ error: "Invoice ID or Installment ID is required" });
    }

    let finalAmount = invoice.amount; // ตั้งค่าเริ่มต้นเป็นยอดเต็ม
    let userWallet = 0;

    if (balance === "Yes") {
      // ดึงข้อมูล wallet จาก User
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { wallet: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      userWallet = user.wallet ?? 0;

      if (userWallet >= invoice.amount) {
        // เงินคงเหลือเพียงพอ หักเงินจาก Wallet และอัปเดตสถานะ Invoice เป็น Paid
        await prisma.user.update({
          where: { id: userId },
          data: { wallet: userWallet - invoice.amount },
        });

        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: "Paid" },
        });

        return res.status(200).json({ message: "Invoice paid successfully using wallet balance" });
      } else {
        // เงินคงเหลือไม่พอ หักเงินทั้งหมดจาก Wallet และคำนวณส่วนต่าง
        await prisma.user.update({
          where: { id: userId },
          data: { wallet: 0 },
        });

        finalAmount = invoice.amount - userWallet; // ส่วนต่างที่ต้องชำระผ่าน Stripe
      }
    }

    // สร้าง Stripe Checkout Session สำหรับส่วนต่างที่เหลือ
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `Payment for Invoice #${invoice.id}`,
            },
            unit_amount: Math.round(finalAmount * 100), // แปลงบาทเป็นสตางค์
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-cancel`,
      metadata: {
        invoice_id: inv ? invoice.id : null,
        installment_id: ins ? invoice.id : null,
        customer_id: userId,
      },
    });    

    res.status(200).json({ url: session.url, amount_due: finalAmount });

  } catch (error) {
    console.error('Error connecting to payment gateway:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { connectPaymentGateway };
