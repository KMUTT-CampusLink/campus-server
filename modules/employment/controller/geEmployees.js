import prisma from '../../../core/db/prismaInstance.js'

const getUsers = async (req, res) => {
    try {
        // const users = await prisma.employee.findMany(); // Retrieve all users from the database
        const users = await prisma.employee.findMany({
            include: {
                faculty: {
                    select: {
                        name: true, // Specify the fields you want from the faculty
                    },
                },
            },
        });
        res.json(users); // Send users as JSON response
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export default getUsers;