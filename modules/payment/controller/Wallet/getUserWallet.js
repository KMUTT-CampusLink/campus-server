import prisma from '../../../../core/db/prismaInstance.js';
import { decodeToken } from '../../middlewares/jwt.js';

export const getUserWallet = async (req, res) => {
  try {
    // ดึง Token จาก cookies
    const token = req.cookies.token;

    // ถอดรหัส Token เพื่อดึง User ID
    const decoded = decodeToken(token);
    const userId = decoded.id;

    // ตรวจสอบว่าได้ userId มาหรือไม่
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    // ดึงข้อมูล wallet จากตาราง user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wallet: true }, // เลือกเฉพาะคอลัมน์ wallet
    });

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบและแปลงค่า wallet เป็น 0 ถ้าเป็น null
    const wallet = user.wallet ?? 0;

    // ส่งข้อมูล wallet กลับไป
    res.status(200).json({ wallet });
  } catch (error) {
    console.error("Error fetching user wallet:", error);
    res.status(500).json({ error: 'Error fetching user wallet' });
  }
};
