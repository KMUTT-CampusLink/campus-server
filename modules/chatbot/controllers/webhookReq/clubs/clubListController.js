import prisma from "../../../../../core/db/prismaInstance.js";

export const clubListController = async (req,res) => {
    //const { name: clubsName } = req.query;
  try {
    const clubs = await prisma.$queryRaw`
            SELECT name
            FROM "club";
        `;
    let fulfillment = "Our university has the following clubs for students to join. \n";
    clubs.map((club, index) => {
      fulfillment += `${index + 1}. ${club.name}\n`;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching clubs: " + error);
    res.status(500).json( { error: "Failed to fetch clubs" });
  }
};
