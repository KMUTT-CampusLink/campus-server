import prisma from "../../../../../core/db/prismaInstance.js";

export const statusCheckController = async (req, res) => {

const { userId } =req.query;
try {

    const data = await prisma.$queryRaw`
    SELECT lost.description,lost.status::TEXT as lostStatus,lost.floor_id,f.name as floor_name,b.name as building_name
    FROM "lost_and_found" as lost,"floor" as f,"building" as b
    WHERE lost.floor_id=f.id
    AND f.building_id=b.id
    AND lost.reporter_id = ${userId}::UUID;
    `;

    let fulfillment = "";
    if(!data || data.lenght === 0){
        res.status(500).json({error:`You do not have any lost items.`});
        return `You do not have any lost items.`;
    }else{
        data.map((datas, index) => {
            if(datas.loststatus === "Lost"){
                fulfillment += `${index + 1}. Your lost item "${datas.description}" is still missing.\n`
            }else{
                fulfillment += `${index + 1}. Your lost item "${datas.description}" is ${datas.loststatus}.\n`
            }
        });
    };
    res.status(200).json({reply: fulfillment});
    console.log(fulfillment);
    return fulfillment;
}
    catch (error) {
    console.error("Error fetching lost and found items: " + error);
    res.status(500).json({ error: "Failed to fetch lost and found items" });
    }
}