import prisma from "../../../../../core/db/prismaInstance.js";

export const clubMemberController = async (req, res) => {
    const { name: clubName } = req.query;
  try {
    
    const clubs = await prisma.$queryRaw`
      Select count(*) as member_count,c1.name
      From club as c1,club_member as c2
      Where c1.id=c2.club_id and c1.name = ${clubName}
      Group by c1.name;
    `;
    let fulfillment = "";
    clubs.map((club) => {
      fulfillment += `The club "${club.name}" has ${club.member_count} members.\n`;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching club members: " + error);
    return "Failed to fetch club members";
  }
};
