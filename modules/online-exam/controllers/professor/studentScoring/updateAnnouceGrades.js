import prisma from "../../../../../core/db/prismaInstance.js";


export default function updateAnnouceGrades(req,res) {
    const sectionId = parseInt(req.body.sectionId);
    const gradeAnnouceStatus = req.body.gradeAnnouceStatus;
    try {
      prisma.section.update({
        where: {
          id: sectionId
        },
        data: {
          grade_announce_status: gradeAnnouceStatus
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
