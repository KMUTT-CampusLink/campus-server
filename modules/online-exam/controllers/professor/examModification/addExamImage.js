import prisma from "../../../../../core/db/prismaInstance.js";

const AddExamImage = async (req, res) => {
  const { examId } = req.params;
  const questions = await prisma.exam_question.findMany({
    where: {
      exam_id: parseInt(examId),
    },
  });

  const result = await req.files.map(async (file) => {
    const question = questions.find((q, idx) => {
      return idx + 1 == file.originalname;
    });
    if (!question) return;
    const updated = await prisma.exam_question.update({
      where: {
        id: question.id,
      },
      data: {
        question_img: file.objName,
      },
    });
    return updated;
  });
  return res.status(200).json(result);
};

export default AddExamImage;
