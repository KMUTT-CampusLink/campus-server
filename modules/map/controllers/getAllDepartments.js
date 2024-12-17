import prisma from "../../../core/db/prismaInstance.js";

const getAllDepartments = async (req, res) => {
  const { campusName } = req.query;

  try {
    const campus = await prisma.campus.findFirst({
      where: {
        name: campusName
      }
    });

    if (!campus) {
      return res.status(404).json({ error: "Campus not found" });
    }

    const buildings = await prisma.building.findMany({
      where: {
        campus_id: campus.id
      }
    });

    const guardSchedule = await prisma.guard_schedule.findMany({
      where: {
        building: {
          campus_id: campus.id
        }
      },
      select: {
        building_id: true,  
      }
    });

    const guardedBuildingIds = new Set(guardSchedule.map(schedule => schedule.building_id));

    const buildingsWithGuardStatus = buildings.map(building => ({
      ...building,
      isGuarded: guardedBuildingIds.has(building.id), 
    }));

    res.json({ buildings: buildingsWithGuardStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching buildings for the campus' });
  }
};

export { getAllDepartments };
