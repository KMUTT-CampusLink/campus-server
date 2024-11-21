import prisma from "../../../core/db/prismaInstance.js";

export const getAllLostAndFound = async (req, res) => {
  try {
    const rawQuery = `
      SELECT 
        lf.name AS itemName,
        lf.description AS detail,
        lf.status,
        f.name AS floorname,
        f.building_id AS buildingId
      FROM lost_and_found lf
      JOIN floor f ON lf.floor_id = f.id
    `;

    const items = await prisma.$queryRawUnsafe(rawQuery);

    const formattedItems = items.reduce((acc, item) => {
        const { buildingid, floorname, itemname, detail, status } = item;

      
        if (!acc[buildingid]) {
          acc[buildingid] = { lostAndFoundList: [] };
        }
      
        const floorEntry = acc[buildingid].lostAndFoundList.find(
          (entry) => entry[floorname]
        );
      
        if (floorEntry) {
          floorEntry[floorname].push({ itemname, detail, status });
        } else {
          acc[buildingid].lostAndFoundList.push({
            [floorname]: [{ itemname, detail, status }],
          });
        }
      
        return acc;
      }, {});
      

    res.status(200).json(formattedItems);
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    res.status(500).json({ error: `Failed to fetch lost and found items: ${error.message}` });
  }
};
