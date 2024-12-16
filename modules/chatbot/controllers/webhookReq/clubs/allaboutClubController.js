import prisma from "../../../../../core/db/prismaInstance.js";

export const allaboutClubController = async (req, res) => {
    const{clubName}=req.query;
  try {

    const infos = await prisma.$queryRaw`
      SELECT c.description as club_description, c.content as club_content, concat(s.firstname,' ',s.lastname) as fullname,b.name as buildingname
      FROM "club" as c ,"student" as s,"building" as b
      where c.owner_id=s.id
      and c.building_id=b.id
      and c.name=${clubName}
    `;

   
    let fulfillment = `The general information for the "${clubName}" are as follows\ `;
    infos.map((info, index) => {
      fulfillment += `${index + 1}. Description: ${info.club_description}\n   Content: ${info.club_content}  \n 
                                     This club is owned by ${info.fullname}\n
                                     The club office is located on ${info.buildingname}`;
    });

    return res.json({ fulfillment });
  } catch (error) {
    console.error("Error fetching information for this club: " + error);
    res.status(500).json({ error: "Failed to fetch information for this club" });
  }
};
