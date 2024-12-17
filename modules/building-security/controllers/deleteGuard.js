import prisma from "../../../core/db/prismaInstance.js";

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Haversine formula to calculate distance between two points (lat, lon)
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters

    return distance;
}

export const deleteGuard = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the request parameters

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Guard ID is required.",
            });
        }

        // 1. Fetch guard_id and building_id from guard_schedule table (use correct field names)
        const guardSchedule = await prisma.guard_schedule.findUnique({
            where: { id: parseInt(id, 10) },
            select: {
                guard_id: true,  // Use correct field name here
                building_id: true,  // Use correct field name here
            },
        });

        if (!guardSchedule) {
            return res.status(404).json({
                success: false,
                message: "Guard schedule not found.",
            });
        }

        const { guard_id, building_id } = guardSchedule;

        // 2. Change guard status to true in the guard table
        await prisma.guard.update({
            where: { id: guard_id },
            data: { status: true },
        });

        // 3. Fetch the building's latitude and longitude
        const building = await prisma.building.findUnique({
            where: { id: building_id },
            select: {
                latitude: true,
                longitude: true,
            },
        });

        if (!building) {
            return res.status(404).json({
                success: false,
                message: "Building not found.",
            });
        }

        const { latitude, longitude } = building;

        // 4. Update guard_status for buildings within 50 meters
        const buildingsToUpdate = await prisma.building.findMany({
            where: {
                id: {
                    not: building_id, // Exclude the current building from the update
                },
            },
        });

        for (const b of buildingsToUpdate) {
            const distance = calculateDistance(latitude, longitude, b.latitude, b.longitude);

            if (distance <= 50) {
                // 5. Update guard_status to true for buildings within 50 meters
                await prisma.building.update({
                    where: { id: b.id },
                    data: { guard_status: true },
                });

                // Log which buildingId's guard_status was updated
                console.log(`Building ID ${b.id} guard_status set to true (within 50 meters of building ${building_id}).`);
            }
        }

        // 6. Also update the guard_status of the current building to true
        await prisma.building.update({
            where: { id: building_id },
            data: { guard_status: true },
        });

        // Log the update for the current building
        console.log(`Building ID ${building_id} guard_status set to true.`);

        // 7. Delete the guard schedule
        const deletedGuard = await prisma.guard_schedule.delete({
            where: {
                id: parseInt(id, 10),
            },
        });

        res.status(200).json({
            success: true,
            message: "Guard deleted successfully and building statuses updated.",
            deletedGuard,
        });
    } catch (error) {
        console.error("Error deleting guard:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete the guard.",
            error: error.message,
        });
    }
};
