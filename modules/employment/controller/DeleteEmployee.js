import prisma from '../../../core/db/prismaInstance.js';

const deleteEmployee = async (req, res) => {
    const { id } = req.params; // Assuming the employee ID is passed as a URL parameter

    try {
        // Validate that 'id' is provided
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required.' });
        }

        // Check if the employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!existingEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Delete the employee record
        await prisma.employee.delete({
            where: { id },
        });

        // Respond with a success message
        res.json({
            message: 'Employee deleted successfully',
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default deleteEmployee;
