import prisma from "../../../../../core/db/prismaInstance.js";

export const availableParkingSlotController = async (building, floor) => {
    // const { building, floor } = req.query;

    try {
            const parked_slots = await prisma.$queryRaw`
            SELECT count(*)
            FROM "building" as b, "parking_slot" as ps, "floor" as f, "parking_reservation" as pr
            WHERE ps.floor_id = f.id
            AND f.building_id = b.id
            AND f.name = ${floor}
            AND pr.status = 'Reserved'
            AND pr.parking_slot_id = ps.id
            AND b.name = ${building};
            `;

            const total_slots = await prisma.$queryRaw`
            SELECT f.parking_capacity
            FROM "building" as b, "floor" as f
            WHERE f.building_id = b.id
            AND f.name = ${floor}
            AND b.name = ${building};
            `;

        const total = total_slots[0].parking_capacity;
        const parked = parseInt(parked_slots[0].count + "");
        const available_parking_slots = total - parked;

        if(total === 0 && !total){
            res.status(500).json({error: `Sorry you cannot park at the ${building} because there is no parking slot.`});
            return `Sorry you cannot park at the ${building} because there is no parking slot.`;
        }else if(availableParkingSlotController === 0){
            return `Sorry, currently there is no parking slots available on the ${floor} of the ${building}.`;
        }else{
            const fulfillment = `The ${building} at the ${floor} has ${available_parking_slots} slots available now.`;
            res.status(200).json({reply: fulfillment});
            return fulfillment;
        }

    } catch (err) {
        console.error(err);
        return "Internal server error";
    }
}