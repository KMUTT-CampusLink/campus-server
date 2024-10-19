import prisma from "../../../../core/db/prismaInstance.js"

export default async function verifyPassword(req, res) {
    const password = parseInt(req.body.password);
    const examId = parseInt(req.body.examId);
    try {
        const queryExamRaw = await prisma.$queryRaw`SELECT "pin" FROM "exam" WHERE id = ${examId}`;
        if (parseInt(queryExamRaw[0].pin) === password) {
            return res.status(200).json({ message: "Password is correct" });
        } else {
            return res.status(400).json({ message: "Password is incorrect" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}