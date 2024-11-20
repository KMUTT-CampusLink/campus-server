import prisma from "../../../../../core/db/prismaInstance.js";
 export const buildingContactController =async(req,res)=>{
    const {buildingName}=req.query;
    try {
        const building=await prisma.$queryRaw`
        SELECT phone
        FROM "building" 
        Where name=${buildingName};`

  if (building.length=== 0||!building) {
    res.status(404).json({ message: `Sorry, we could not find any information for contact of that building ` });
   // return `Sorry, we could not find any information for the contact of that building.`;
}

//return `The contact for the  ${buildingName}  is ${building[0].phone}`;
res.status(200).json({
    message: `The contact for the  ${buildingName}  is ${building[0].phone}`
});
    } catch (error) {
        console.error("Error fetching the contact for the building " + error);
        //  return {error: "Failed to fetch exam score"};
        res.status(500).json({ error: "Failed to fetch contact for the building" });
    }
 }