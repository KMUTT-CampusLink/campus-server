import prisma from "../../../core/db/prismaInstance.js";

export const faqController = async (req, res) => {
    try{
        const faqs = await prisma.$queryRaw`
        SELECT question
        FROM "FAQ"
        ORDER BY RANDOM()
        LIMIT 8;`
        res.json(faqs);
    }
    catch(error){
        console.error("Error fetching faqs: " + error);
        res.status(500).json({error: "Failed to fetch faqs"});
    }
}