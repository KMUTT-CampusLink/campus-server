import prisma from "../../../core/db/prismaInstance.js";

const getUsers = async (req, res) => {
  try {
    const users = await prisma.employee.findMany({
      include: {
        faculty: {
          select: {
            name: true, 
          },
        },
        address: {
          select: {
            address: true, 
          },
        },
      },
      orderBy: {
        id: "asc", 
      },
    });
    res.json(users); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getUsers;
