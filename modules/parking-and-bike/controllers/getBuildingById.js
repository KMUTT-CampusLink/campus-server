import prisma from "../../../core/db/prismaInstance.js";

const getBuildingById = async (req, res) => {
    const { building_id } = req.params;

    try {
        const getFloor = await prisma.$queryRaw`
            SELECT b.id, b.name AS building_name, b.building_img,
            json_agg(
                json_build_object(
                    'floor_id', f.id,
                    'floor_name', f.name,
                    'floor_capacity', f.parking_capacity,
                    'floor_reserved_slots', (
                        SELECT COUNT(*) 
                        FROM parking_slot AS s
                        WHERE s.floor_id = f.id AND s.status = false
                    ),
                    'slots', (
                        SELECT json_agg(
                            json_build_object(
                                'slot_id', s.id,
                                'slot_name', s.name,
                                'slot_status', s.status
                            )
                            ORDER BY s.id
                        )
                        FROM parking_slot AS s
                        WHERE s.floor_id = f.id
                    )
                ) ORDER BY f.id
            ) as floors
            FROM building AS b
            JOIN floor AS f ON f.building_id = b.id
            WHERE b.id = ${parseInt(building_id)}
            GROUP BY b.id
        `;

        res.json(getFloor);
    } catch (error) {
        console.error("Error fetching building:", error);
        res.status(500).json({ error: "Error fetching building" });
    }
};

export { getBuildingById };