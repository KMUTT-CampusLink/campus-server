import prisma from "../../../core/db/prismaInstance.js";

export const checkUnpaidInvoices = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        const overdueInvoice = await prisma.invoice.findFirst({
            where: {
                user_id: userId,
                status: "Unpaid",
                due_date: { lt: now },
                issued_date: { lt: new Date(now.setFullYear(now.getFullYear() - 1)) }, // Older than 12 months
            },
        });

        if (overdueInvoice) {
            return res.status(403).json({
                error: "Access denied. Your account is blocked due to unpaid invoices older than 12 months. Please contact support.",
            });
        }

        next(); // Allow access if no overdue invoices
    } catch (error) {
        console.error("Error in checkUnpaidInvoices middleware:", error);
        res.status(500).json({ error: "Error checking unpaid invoices" });
    }
};
