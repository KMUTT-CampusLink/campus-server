import prisma from "../../../../../core/db/prismaInstance.js";
 export const examScoreController =async(studentId, examTitle)=>{
    try {
        const examscore=await prisma.$queryRaw`
        SELECT total_score ,title
        FROM "student_exam" as sex,"exam" as ex,"student" as stu
        Where sex.exam_id=ex.id
        AND sex.student_id=stu.id
        AND stu.id=${studentId}
        AND ex.title=${examTitle};`

  if (examscore.length=== 0||!examscore) {
    // res.status(404).json({ message: `Sorry, we could not find any information for the score ` });
   return `Sorry, we could not find any information for the score.`;
}

return `Your score for ${examscore[0].title} (${studentId})is ${examscore[0].total_score} marks`;
// res.status(200).json({
//     message: `Your score for ${examscore[0].title}  is ${examscore[0].total_score} marks`
// });
    } catch (error) {
        console.error("Error fetching exam score " + error);
        return {error: "Failed to fetch exam score"};
        // res.status(500).json({ error: "Failed to fetch exam score" });
    }
 }