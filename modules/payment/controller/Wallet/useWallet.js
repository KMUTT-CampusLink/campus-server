import prisma from '../../../../core/db/prismaInstance.js';
import { decodeToken } from '../../middlewares/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const useWallet = async (req, res) => {
  try {
    const { inv, ins } = req.body;

    // ดึง User ID จาก Token
    const token = req.cookies.token;
    const decoded = decodeToken(token);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    let paymentItem; // ข้อมูล Invoice หรือ Installment
    let amountToPay = 0; // จำนวนเงินที่ต้องจ่าย

    if (inv) {
      // ค้นหา Invoice
      paymentItem = await prisma.invoice.findUnique({
        where: { id: inv.toString() },
      });

      if (!paymentItem) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      amountToPay = paymentItem.amount;
    } else if (ins) {
      // ค้นหา Installment
      paymentItem = await prisma.installment.findUnique({
        where: { id: ins.toString() },
      });

      if (!paymentItem) {
        return res.status(404).json({ error: "Installment not found" });
      }

      amountToPay = paymentItem.amount;
    } else {
      return res.status(400).json({ error: "Invoice ID or Installment ID is required" });
    }

    // ดึงข้อมูล wallet ของ User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wallet: true },
    });

    

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWallet = user.wallet ?? 0;
    console.log(userWallet);
    console.log(amountToPay);
    // if (userWallet < amountToPay) {
    //     console.log(user.wallet);
    //   return res.status(400).json({ error: "Insufficient wallet balance" });
    // }

    // หักเงินจาก Wallet และอัปเดตสถานะเป็น Paid
    await prisma.user.update({
      where: { id: userId },
      data: { wallet: userWallet - amountToPay },
    });

    if (inv) {
      await prisma.invoice.update({
        where: { id: inv.toString() },
        data: { status: "Paid" , paid_date: new Date() },
      });
    } else if (ins) {
      await prisma.installment.update({
        where: { id: ins.toString() },
        data: { status: "Paid",  paid_date: new Date() },
      });
    }

    res.status(200).json({
      message: "Payment completed using wallet balance",
      amount_paid: amountToPay,
      remaining_wallet: userWallet - amountToPay,
    });
  } catch (error) {
    console.error('Error processing wallet payment:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { useWallet };
