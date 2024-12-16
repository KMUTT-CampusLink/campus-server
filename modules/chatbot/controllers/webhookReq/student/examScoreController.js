import prisma from "../../../../../core/db/prismaInstance.js";
 export const examScoreController =async(req,res)=>{
    let {studentId,courseName}=req.query;
    studentId=studentId.trim();
    courseName=courseName.trim();
    try {
        const examscore=await prisma.$queryRaw`
        SELECT sex.total_score as score ,ex.title,c.name
        FROM "student_exam" as sex,"exam" as ex,"student" as stu,"semester" as sm,"section" as s,"course" as c
        Where sex.exam_id=ex.id
        AND ex.section_id=s.id
        AND s.course_code=c.code
        AND sex.student_id=stu.id
        AND c.name=${courseName}
        AND stu.id=${studentId};`
        //console.log(examscore);

  if (examscore.length=== 0||!examscore) {
    res.status(404).json({ message: `Sorry, we could not find any information for the score ` });
   // return `Sorry, we could not find any information for the score.`;
}else{
    //return `Your score for ${courseName}  is ${examscore[0].score} marks`;
    res.status(200).json({
        message: `Your score for ${courseName}  is ${examscore[0].score} marks`
    });
}

    } catch (error) {
        console.error("Error fetching exam score " + error);
        //  return {error: "Failed to fetch exam score"};
        res.status(500).json({ error: "Failed to fetch exam score" });
    }
 }