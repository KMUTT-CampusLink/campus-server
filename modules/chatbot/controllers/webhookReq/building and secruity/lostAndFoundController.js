import prisma from "../../../../../core/db/prismaInstance.js";

export const lostAndFoundController = async (req, res) => {

 const {Status} =req.query;
  try {

    const datas = await prisma.$queryRaw`
      SELECT lost.description,lost.status,lost.name as reporter,lost.floor_id,f.name as floor_name,b.name as building_name
      FROM "lost_and_found" as lost,"floor" as f,"building" as b 
      WHERE lost.floor_id=f.id
      AND f.building_id=b.id
      AND lost.status=${Status}::lost_found_status_enum
      
    `;

   
    let fulfillment = `Here are the list of ${Status} items :\n`;
    datas.map((data, index) => {
      fulfillment += `${index + 1}. Item: ${data.description}\n   Reported by: ${data.reporter}\n   Place:${data.building_name} (${data.floor_name})`;
    });

    return res.json({ fulfillment });
  } catch (error) {
    console.error("Error fetching lost and found items: " + error);
    res.status(500).json({ error: "Failed to fetch lost and found items" });
  }
};
