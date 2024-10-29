import prisma from "../../../../../core/db/prismaInstance.js";

export const campusListController = async (req, res) => {
    try {
        const data = await prisma.campus.findMany({
            select: {
                name: true,
            }
        });
        
        const fulfillment = `Our university has the following campus. ${data.map((obj, index) => `\n${index + 1}. ${obj.name}`)}`
        return fulfillment;
    } catch (err) {
        console.error(err);
        return "Internal server error";
    }
}