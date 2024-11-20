import { fetchLostAndFoundInterMap } from "../controllers/LostAndFoundServiceInterMap.js";

export const getLostAndFoundInterMap = async (req, res) => {
  try {
    const lostAndFoundList = await fetchLostAndFoundInterMap();

    res.status(200).json({ lostAndFoundList });
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    res.status(500).json({
      message: "An error occurred while fetching the lost and found items.",
    });
  }
};
