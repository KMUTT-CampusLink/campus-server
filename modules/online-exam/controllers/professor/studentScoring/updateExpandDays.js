import prisma from "../../../../../core/db/prismaInstance.js";

export default function updateExpandDays(req,res) {
  const sectionId = parseInt(req.body.sectionId);
  const isGradingExpand = req.body.isGradingExpand;
  try {
    prisma.section.update({
      where: {
        id: sectionId
      },
      data: {
        is_grading_expand: isGradingExpand,
      }
    }).then(() => {
      return res.status(200).json({ message: "Grading status updated" });
    }).catch((error) => {
      console.error(error);
      return res.status(500).json({ message: error.message });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  
}
