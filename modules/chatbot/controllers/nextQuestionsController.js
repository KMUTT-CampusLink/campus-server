import prisma from "../../../core/db/prismaInstance.js";
import { prevPage, parameters } from "./getReplyController.js";

export const nextQuestionsController = async (req, res) => {
    try{
        const nextQues = await prisma.$queryRaw`
        SELECT next_question
        FROM "next_question"
        WHERE next_question.page_name = ${prevPage} and next_question.params = ${parameters}
        ORDER BY count
        LIMIT 3;`
        res.json(nextQues);
    }
    catch(error){
        console.error("Error fetching next questions: " + error);
        res.status(500).json({error: "Failed to fetch faqs"});
    }
}