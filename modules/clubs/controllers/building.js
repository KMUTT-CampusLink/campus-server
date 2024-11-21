import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

// Fetch building name by id
export const getAllBuildings = async (req, res) => {
    try{
        const buildings = await prisma.building.findMany({
            select:{
                id: true,
                name: true,
            },
        });
        return res.status(200).json({ success: true, data: buildings });
    }catch(error){
        console.error("Failed to fetch buildings: ", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to fetch buildings" });
    }
};