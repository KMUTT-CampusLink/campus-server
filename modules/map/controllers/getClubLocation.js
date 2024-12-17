import prisma from "../../../core/db/prismaInstance.js";

export const getClubLocation = async (req, res) => {
  const { buildingId } = req.query;
  try {
    const location = await prisma.club.findMany({
      where: {
        building_id: parseInt(buildingId), // like WHERE building_id = buildingId
      },
      select: {
        name: true,
        _count: {
            select: { club_member: true }, // Counts the club members directly
          },
      },
    });
    res.json({ location }); //return fetched data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching club location" });
  }
};