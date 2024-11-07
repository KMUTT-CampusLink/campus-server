// import prisma from "../../../core/db/prismaInstance.js";

// const getFloorById = async (req, res) => {
//     const { floor_id } = req.params;

//     try {
//         const getSlot = await prisma.$queryRaw`
//             SELECT f.id, f.name, array_agg(concat('id= ', s.id, ' : ', 'name= ', s.name, ' : ', 'status= ', s.status)) as slots
//             FROM floor as f, parking_slot as s
//             WHERE s.floor_id = ${parseInt(floor_id)} and s.floor_id = f.id
//             GROUP BY f.id
//         `;

//         res.json(getSlot);
//     } catch (error) {
//         console.error("Error fetching floor:", error);
//         res.status(500).json({ error: "Error fetching floor" });
//     }
// };

// export { getFloorById };

//ไม่ใช้แล้วเพราะใส่ slot เข้าไปในแต่ละ floor ใน path แรกเลย