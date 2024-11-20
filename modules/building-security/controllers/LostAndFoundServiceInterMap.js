import prisma from "../../../core/db/prismaInstance.js";

export const fetchLostAndFoundInterMap = async () => {
  try {
    console.log("Fetching lost and found items...");
    const items = await prisma.lost_and_found.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        floor_id: true,
        created_at: true,
        floor: {
          select: {
            building_id: true,
          },
        },
      },
    });

    // Transform data to the desired structure
    const formattedItems = items.reduce((acc, item) => {
      const buildingId = item.floor.building_id;
      const floorId = item.floor_id;

      // Initialize buildingId and floorId if not present
      if (!acc[buildingId]) acc[buildingId] = {};
      if (!acc[buildingId][floorId]) acc[buildingId][floorId] = [];

      // Add the item to the appropriate buildingId and floorId
      acc[buildingId][floorId].push({
        itemName: item.name,
        detail: item.description,
        status: item.status,
      });

      return acc;
    }, {});

    console.log("Formatted items:", JSON.stringify(formattedItems, null, 2));
    return formattedItems;
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    throw new Error(`Failed to fetch lost and found items: ${error.message}`);
  }
};
