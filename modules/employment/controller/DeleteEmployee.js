import prisma from '../../../core/db/prismaInstance.js';

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required.' });
        }

        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!existingEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Retrieve the associated user ID
        const userInfo = await prisma.employee.findUnique({
            where: { id },
            select: {
                user_id: true,
                user: { select: { id: true } }
            },
        });

        await prisma.employee.delete({
            where: { id },
        });

        // Delete the associated user record
        await prisma.user.delete({
            where: { id: userInfo.user.id }
        });

        // Delete the employee record
        

        // Respond with a success message
        res.json({
            message: 'Employee and associated user deleted successfully',
            message: 'Employee and associated user deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default deleteEmployee;
