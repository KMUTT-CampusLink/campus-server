import prisma from "../../../core/db/prismaInstance.js";

const getParking = async (req, res) => {
    try {
        const getParking = await prisma.$queryRaw`
           SELECT b.id, b.name, b.building_img, b.parking_capacity,
                (SELECT CAST(COUNT(*) AS INT)
                FROM parking_slot AS s 
                WHERE s.floor_id IN (SELECT id 
                                    FROM floor 
                                    WHERE building_id = b.id) 
                                    AND s.status = false) AS reserved_slots
            FROM building AS b
            WHERE b.parking_capacity > 0
        `;

        res.json(getParking);
    } catch (error) {
        console.error("Error fetching parking:", error);
        res.status(500).json({ error: "Error fetching parking" });
    }
};

export { getParking };