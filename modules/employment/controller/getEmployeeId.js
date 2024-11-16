import prisma from "../../../core/db/prismaInstance.js";

const getEmployeeById = async (req, res) => {
  const { id } = req.params; // Get 'id' from the request parameters

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: id },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        address: true,
      },
    });

    if (!employee) {
      // If no employee found, return xa 404 response
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee); // Send the employee as a JSON response
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getEmployeeById;
