import prisma from "../../../core/db/prismaInstance.js";

const getAllDepartments = async (req, res) => {
    const { campusName } = req.query;
      
    try {
      const campus = await prisma.campus.findFirst({
        where: {
          name: campusName
        }
      });
  
      if (!campus) {
        return res.status(404).json({ error: "Campus not found" });
      }
  
      const buildings = await prisma.building.findMany({
        where: {
          campus_id: campus.id
        }
      });
      res.json({ buildings });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Error fetching buildings for the campus' });
    }
  };
  
export { getAllDepartments };


