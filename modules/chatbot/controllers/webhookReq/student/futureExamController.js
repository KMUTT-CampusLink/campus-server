import prisma from "../../../../../core/db/prismaInstance.js";
 export const futureExamController =async(studentId, examTitle)=>{
    studentId = studentId.trim();
    examTitle = examTitle.trim();
    try {
        const future_exam=await prisma.$queryRaw`
        select e.title, e.start_date 
        from exam as e,section as s,semester as sm,student as stu ,course as c
        where e.section_id=s.id
        and s.semester_id=sm.id
        and s.course_code=c.code
        and sm.id=stu.semester_id
        and e.start_date>current_date
        and stu.id=${studentId}
        and e.title=${examTitle};`
    console.log(future_exam);
  if (future_exam.length=== 0||!future_exam) {
    // res.status(404).json({ message: `There is no examination yet` });
   return `There is no examination yet`;
  }else{
      return `The examination for ${examTitle}  is  at${future_exam[0].start_date}`;
    //   res.status(200).json({
    //       message: `The examination for ${examTitle}  is  at  ${future_exam[0].start_date} `
    //   });
  }
    } catch (error) {
        console.error("Error fetching future exam " + error);
         return {error: "Error fetching future exam"};
        // res.status(500).json({ error: "Failed to fetch future exam" });
    }
 }