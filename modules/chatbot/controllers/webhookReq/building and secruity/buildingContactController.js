import prisma from "../../../../../core/db/prismaInstance.js";

 export const buildingContactController =async(buildingName)=>{
    try {
        const building=await prisma.$queryRaw`
        SELECT *
        FROM "building"
        Where name=${buildingName};`

  if (!building || building.length=== 0) {
    // res.status(404).json({ message: `Sorry, we could not find any information for contact of that building.` });
   return `Sorry, we could not find any information for the contact of that building.`;
}

    return `The contact information for the ${buildingName} is as follows.\nPhone: ${building[0].phone} \t\t Fax: ${building[0].fax}\nLocation: ${building[0].location}`;
// res.status(200).json({
//     message: `The contact information for the ${buildingName} is as follows.\nPhone: ${building[0].phone} \t\t Fax: ${building[0].fax}\nLocation: ${building[0].location}`
// });
    } catch (error) {
        console.error("Error fetching the contact for the building " + error);
         return "Internal Server Error.";
        // res.status(500).json({ error: "Failed to fetch contact for the building" });
    }
}