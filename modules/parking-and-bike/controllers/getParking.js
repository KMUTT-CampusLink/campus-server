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
            ORDER BY reserved_slots
        `;

        res.json(getParking);

    } catch (error) {
        console.error("Error fetching parking: ", error);
        res.status(500).json({ error: "Error fetching parking" });
    }
};

export { getParking };

// Just building not array floor and slot

// {
//     "id": 1002,
//     "name": "School of Information Technology Building",
//     "building_img": "https://regis.kmutt.ac.th/web/wp-content/uploads/2020/07/sit_600x400px.jpg",
//     "parking_capacity": 10,
//     "reserved_slots": 10
// },


//-----------------------------------------------------------------
//-----------------------------------------------------------------


// import prisma from "../../../core/db/prismaInstance.js";

// const getParking = async (req, res) => {
//     try {
//         const getParking = await prisma.$queryRaw`
//             SELECT 
//                 b.id, 
//                 b.name AS building_name, 
//                 b.building_img, 
//                 b.parking_capacity,
//                 -- Total reserved slots for the building
//                 (SELECT CAST(COUNT(*) AS Int) 
//                  FROM parking_slot AS s 
//                  WHERE s.floor_id IN (
//                      SELECT id 
//                      FROM floor 
//                      WHERE building_id = b.id
//                  ) AND s.status = false
//                 ) AS reserved_slots,
//                 -- Detailed floor and slot structure
//                 json_agg(
//                     json_build_object(
//                         'floor_id', f.id,
//                         'floor_name', f.name,
//                         'floor_capacity', f.parking_capacity,
//                         'floor_reserved_slots', (
//                             SELECT COUNT(*) 
//                             FROM parking_slot AS s
//                             WHERE s.floor_id = f.id AND s.status = false
//                         ),
//                         'slots', (
//                             SELECT json_agg(
//                                 json_build_object(
//                                     'slot_id', s.id,
//                                     'slot_name', s.name,
//                                     'slot_status', s.status
//                                 )
//                                 ORDER BY s.id
//                             )
//                             FROM parking_slot AS s
//                             WHERE s.floor_id = f.id
//                         )
//                     ) ORDER BY f.id
//                 ) AS floors
//             FROM building AS b
//             LEFT JOIN floor AS f ON f.building_id = b.id
//             WHERE b.parking_capacity > 0
//             GROUP BY b.id
//             ORDER BY reserved_slots
//         `;

//         res.json(getParking);
//     } catch (error) {
//         console.error("Error fetching parking:", error);
//         res.status(500).json({ error: "Error fetching parking" });
//     }
// };

// export { getParking };