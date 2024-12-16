import prisma from "../../../core/db/prismaInstance.js"; // Assuming the correct Prisma instance is imported

export const getGuardSchedule = async (req, res) => {
  try {
    // Fetching guard schedules along with related employee and user data
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
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    // Processing each guard schedule to concatenate guard's firstname + lastname (guardName)
    const schedulesWithGuardNames = guardSchedules.map((schedule) => ({
      ...schedule,
      guardName: `${schedule.guard.employee.firstname} ${schedule.guard.employee.lastname}`,
      // Concatenating the userName (using user_id and joining user to employee)
      userName: `${schedule.user?.employee?.firstname || ''} ${schedule.user?.employee?.lastname || ''}`,
    }));


    // Sending the response back with the modified schedules
    res.status(200).json({
      success: true,
      data: schedulesWithGuardNames,
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
