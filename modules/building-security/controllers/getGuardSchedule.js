import prisma from "../../../core/db/prismaInstance.js"; // Assuming the correct Prisma instance is imported

export const getGuardSchedule = async (req, res) => {
  try {
    // Fetching guard schedules along with related employee, user, and building data
    const guardSchedules = await prisma.guard_schedule.findMany({
      orderBy: { created_at: 'desc' }, // Ordering by creation date
      include: {
        // Fetching guard's employee data (guardName)
        guard: {
          include: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        // Fetch user information using user_id and link to the employee to fetch their firstname and lastname
        user: {
          select: {
            id: true,  // Include the userId
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        // Fetching building data using building_id from guard_schedule
        building: {
          select: {
            name: true,  // Assuming the building name is stored as buildingName
          },
        },
      },
    });

    // Create a map to associate userId with userName
    const userNameMap = new Map();

    // Populate the map with userId as key and full name as value
    guardSchedules.forEach((schedule) => {
      const fullName = `${schedule.user?.employee?.firstname || ''} ${schedule.user?.employee?.lastname || ''}`;
      userNameMap.set(schedule.user?.id, fullName);
    });

    // Processing each guard schedule to concatenate guard's firstname + lastname (guardName)
    const schedulesWithGuardNamesAndBuilding = guardSchedules.map((schedule) => ({
      ...schedule,
      guardName: `${schedule.guard.employee.firstname} ${schedule.guard.employee.lastname}`,
      // Map userId to userName using the created map
      userName: userNameMap.get(schedule.user?.id) || '',  // Default to empty string if userName not found
      // Adding the building name to the schedule
      buildingName: schedule.building?.name || '',  // Default to empty string if buildingName not found
    }));

    // Sending the response back with the modified schedules
    res.status(200).json({
      success: true,
      data: schedulesWithGuardNamesAndBuilding,
    });
  } catch (error) {
    // Logging the error and sending a failure response
    console.error('Error fetching guard schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guard schedule',
      error: error.message,
    });
  } finally {
    // Disconnecting Prisma Client
    await prisma.$disconnect();
  }
};
