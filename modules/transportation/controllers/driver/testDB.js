import prisma from "../../../../core/db/prismaInstance.js";

export default async function showBookingsForDrive(req, res) {
  try {
    const queryResponse = await prisma.user.findMany({});

    res.json({ queryResponse });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while acessing database." });
  } finally {
    await prisma.$disconnect();
  }
}
