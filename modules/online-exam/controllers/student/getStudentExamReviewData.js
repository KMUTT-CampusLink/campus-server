import prisma from "../../../../core/db/prismaInstance.js";
import { decodeToken } from "../../middleware/jwt.js";

export default async function getStudentExamReviewData(req, res) {
  const examId = parseInt(req.query.examId);
  const studentExamId = parseInt(req.query.studentExamId);
  const token = req.cookies.token;
  const decoded = decodeToken(token);
  const studentId = decoded.studentId;
  try {
    const studentExamReviewData = await getOverviewData(examId, studentExamId);
    const studentAnswers = await getEachQuestion(examId, studentId);
    const response = {
      ...studentExamReviewData,
      studentAnswers,
    };
    const PermissionStatus = await prisma.$queryRaw`SELECT view_history FROM exam WHERE id = ${examId}`;
    return res.status(200).json({response: response, PermissionStatus: PermissionStatus[0]});
  } catch (e) {
    return res.status(500).json({ message: e });
  }
}

const getOverviewData = async (examId, studentExamId) => {
  const examNameAndFullScore = await prisma.exam.findFirst({
    where: {
      id: examId,
    },
    select: {
      title: true,
      full_mark: true,
      pass_mark: true,
    },
  });

  const totalScore = await prisma.student_exam.findFirst({
    where: {
      id: studentExamId,
    },
    select: {
      total_score: true,
      status: true,
    },
  });

  return {
    ...examNameAndFullScore,
    ...totalScore,
  };
};

const getEachQuestion = async (examId, studentId) => {
  const studentAns = await prisma.exam_question.findMany({
    where: {
      exam_id: examId,
    },
    select: {
      type: true,
      title: true,
      question_img: true,
      id: true,
      exam_choice: {
        select: {
          choice_text: true,
          choice_img: true,
        },
      },
      student_answer: {
        where: {
          student_id: studentId,
        },
        select: {
          answer: true,
          question_id: true,
          ans_correct: true,
          essay_comment: true,
        },
      },
    },
  });

  const scoreAndMark = await Promise.all(
    studentAns.map(async (a) => {
      const score = await getEacQuestionScore(a.id);
      const mark = await getEachQuestionMark(a.id, studentId);
      return {
        ...a,
        score,
        mark,
      };
    })
  );

  return scoreAndMark;
};

const getEachQuestionMark = async (questionId, studentId) => {
  const questionType =
    await prisma.$queryRaw`SELECT type, mark FROM exam_question WHERE id = ${questionId}`;
  if (questionType[0].type == "Essay") {
    const studentScore =
      await prisma.$queryRaw`SELECT essay_score FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId}`;
    return parseFloat(studentScore[0].essay_score);
  } else if (questionType[0].type == "Multiple Choice") {
    const studentScore =
      await prisma.$queryRaw`SELECT count(*) FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId} AND ans_correct = true`;
    return parseFloat(studentScore[0].count) * questionType[0].mark;
  } else {
    const choiceAmount =
        await prisma.$queryRaw`SELECT count(*) FROM exam_choice WHERE question_id = ${questionId}`;
      const studentScore =
        await prisma.$queryRaw`SELECT count(*) FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId} AND ans_correct = true`;
      const studnetScore2 =
        await prisma.$queryRaw`SELECT count(*) FROM exam_choice WHERE question_id = ${questionId} AND correct_ans = false AND choice_text NOT IN (SELECT answer FROM student_answer WHERE question_id = ${questionId} AND student_id = ${studentId})`;
        const studentTotalScore = choiceAmount[0].count === studentScore[0].count + studnetScore2[0].count ? Math.round(parseInt(studentScore[0].count + studnetScore2[0].count) * parseFloat(questionType[0].mark)) : parseInt(studentScore[0].count + studnetScore2[0].count) * parseFloat(questionType[0].mark);
    return studentTotalScore;
  }
};

const getEacQuestionScore = async (questionId) => {
  const questionType =
    await prisma.$queryRaw`SELECT type FROM exam_question WHERE id = ${questionId}`;
  if (questionType[0].type == "Essay") {
    const essayScore =
      await prisma.$queryRaw`SELECT mark FROM exam_question WHERE id = ${questionId}`;
    const maxScore = parseFloat(essayScore[0].mark);
    return maxScore;
  } else if (questionType[0].type == "Checklist") {
    const choiceAmount =
      await prisma.$queryRaw`SELECT count(*) FROM exam_choice WHERE question_id = ${questionId}`;
    const checklistScore =
      await prisma.$queryRaw`SELECT eq.mark, count(*), eq.id FROM exam_question AS eq, exam_choice AS ec WHERE eq.id = ec.question_id AND eq.id = ${questionId} GROUP BY eq.id`;
    const maxScore = checklistScore[0].count === choiceAmount[0].count? Math.round(parseFloat(checklistScore[0].mark) * parseFloat(checklistScore[0].count)) : parseFloat(checklistScore[0].mark) * parseFloat(checklistScore[0].count);
    return maxScore;
  } else {
    const multipleChoiceScore =
      await prisma.$queryRaw`SELECT mark FROM exam_question WHERE id = ${questionId} AND type = 'Multiple Choice'`;
    return parseFloat(multipleChoiceScore[0].mark);
  }
};
