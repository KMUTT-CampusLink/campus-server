import jwt from "jsonwebtoken";
import prisma from "../../../core/db/prismaInstance.js";

export const withdrawEnrollmentDetail = async (req, res) => {
    const { selectedEnrollmentId } = req.params;

    if (!selectedEnrollmentId) {
        return res
            .status(400)
            .json({ message: "Enrollment detail ID is required." });
    }

    try {
        await prisma.$executeRaw`
            UPDATE enrollment_detail 
            SET grade_id = 1011, status = 'Withdraw' 
            WHERE id = ${Number(selectedEnrollmentId)};
        `;

        // Call updateRefund function
        await updateRefund(selectedEnrollmentId);

        return res
            .status(200)
            .json({ message: "Enrollment successfully withdrawn and wallet updated." });
    } catch (error) {
        console.error("Error withdrawing enrollment detail:", error);
        return res
            .status(500)
            .json({ message: "Error withdrawing enrollment detail." });
    }
};

export async function updateRefund(selectedEnrollmentId) {
    try {
        // Fetch the student_id from enrollment_detail
        const studentData = await prisma.$queryRaw`
            SELECT student_id 
            FROM enrollment_detail 
            WHERE id = ${Number(selectedEnrollmentId)};
        `;

        if (!studentData.length) {
            throw new Error("Student not found.");
        }

        const { student_id } = studentData[0];

        // Fetch the user_id from student table
        const userData = await prisma.$queryRaw`
            SELECT user_id 
            FROM student 
            WHERE id = ${student_id};
        `;

        if (!userData.length) {
            throw new Error("User not found.");
        }

        const { user_id } = userData[0];

        // Update the wallet column in user table
        await prisma.$executeRaw`
       UPDATE "user" 
       SET wallet = COALESCE(wallet, 0) + 2000 
       WHERE id = ${user_id}::uuid;
   `;
        // Create a new invoice entry
        await prisma.$executeRaw`
    INSERT INTO invoice (user_id, issued_by, title, issued_date, due_date, amount, status)
    VALUES (${user_id}::uuid, 'Registration', 'Course Refund', NOW(), NOW(), 2000, 'Paid');
`;


        console.log("Wallet updated successfully.");
    } catch (error) {
        console.error("Error updating wallet:", error);
        throw new Error("Error updating wallet.");
    }
}

export const getAllTransactionsByUserId = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        // const { userId } = req.params;
        // Fetch all transactions from the invoice table for the user
        const transactions = await prisma.$queryRaw`
        SELECT * 
        FROM invoice 
        WHERE user_id = ${userId}::uuid AND status = 'Paid';
      `;
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};