import prisma from "../../../core/db/prismaInstance.js";

const getParking = async (req, res) => {
    try {
    const queryParking = await prisma.$queryRaw`
    SELECT b.name, b.parking_img, f.name, s.name ,s.status
    FROM parking_building as b, parking_floor as f, parking_slot as s, verified_car as v
    WHERE b.id = f.parking_building_id AND f.id = s.parking_floor_id
    `;

    // const floorCount = await prisma.$queryRaw`
    // SELECT COUNT(s.status) as floorCount
    // FROM parking_building as b, parking_floor as f, parking_slot as s, verified_car as v
    // WHERE b.id = f.parking_building_id AND f.id = s.parking_floor_id AND s.status = true
    // `;

    // const licenseVerify = await prisma.$queryRaw`
    // SELECT v.license_no
    // FROM verified_car as v
    // `;

    const events = await prisma.parking_building.findMany({
        include: {
          parking_floor: true
        },
    });
        res.json(events);
    } catch (error) {
        console.error("Error fetching parking events:", error);
        res.status(500).json({ error: "Error fetching parking events" });
    }
};

export { getParking };
