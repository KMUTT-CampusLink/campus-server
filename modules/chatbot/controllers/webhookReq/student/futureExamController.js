import prisma from "../../../../../core/db/prismaInstance.js";
 export const futureExamController =async(studentId)=>{
    try {
        const future_exam = await prisma.$queryRaw`
        select e.title, e.start_date, c.name
        from exam as e,section as s,student as stu ,course as c
        where e.section_id=s.id
        and s.semester_id=stu.semester_id
        and s.semester_id=stu.semester_id
        and s.course_code=c.code
        and e.start_date > current_date
        and stu.id=${studentId}
        ;`
    console.log(future_exam);
  if (future_exam.length=== 0||!future_exam) {
    // res.status(404).json({ message: `There is no examination yet` });
   return `There is no examination yet.`;
  }
  let fulfillment = "You have the following exams.\n\n";
  future_exam.map((exam, index) => {
    fulfillment += `${index + 1}. Course Name: ${exam.name}\nExam Start Date: ${new Date(exam.start_date).toLocaleDateString()} Time: ${new Date(exam.start_date).toLocaleTimeString()}\n\n`;
  })

    return fulfillment;
    //   res.status(200).json({
    //       message: `The examination for ${examTitle}  is  at  ${future_exam[0].start_date} `
    //   });
    } catch (error) {
        console.error("Error fetching future exam " + error);
         return "Internal Server Error";
        // res.status(500).json({ error: "Failed to fetch future exam" });
    }
 }