import prisma from "../../../core/db/prismaInstance.js";

const getAllContactNumber = async (req, res) => {
  try {
    const buildingsWithCampus = await prisma.building.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        fax: true,
        campus: {
          select: {
            name: true, 
          },
        },
      },
    });

    const groupedByCampus = buildingsWithCampus.reduce((acc, building) => {
      const campusName = building.campus.name;
      if (!acc[campusName]) {
        acc[campusName] = [];
      }
      acc[campusName].push({
        id: building.id,
        name: building.name,
        phone: building.phone,
        fax: building.fax,
      });

      acc[campusName].sort((a, b) => a.name.localeCompare(b.name));

      return acc;
    }, {});

    res.json(groupedByCampus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching contact numbers' });
  }
};

export { getAllContactNumber };
