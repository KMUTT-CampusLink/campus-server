import prisma from "../../../../../core/db/prismaInstance.js";

export const allaboutClubController = async (clubName) => {
  try {
    const infos = await prisma.$queryRaw`
      SELECT c.description as club_description, c.content as club_content, concat(s.firstname,' ',s.lastname) as fullname,b.name as buildingname
      FROM "club" as c ,"student" as s,"building" as b
      where c.owner_id=s.id
      and c.building_id=b.id
      and c.name=${clubName}
    `;
    if(!infos || infos.length === 0){
      return `There is no information about the ${clubName}.`;
    }
    let fulfillment = `The general information for the "${clubName}" are as follows.\n`;
    infos.map((info) => {
      fulfillment += `Description: ${info.club_description}\nContent: ${info.club_content}\nThis club is created by ${info.fullname}.\nThe club office is located on ${info.buildingname}.`;
    });

    return  fulfillment;
  } catch (error) {
    console.error("Error fetching information for this club: " + error);
    // res.status(500).json({ error: "Failed to fetch information for this club" });
    return "Internal Server Error";
  }
};
