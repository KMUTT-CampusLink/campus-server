import prisma from '../../../../../core/db/prismaInstance.js';

export const invoiceDetailController = async (req,res) => {
    const { id } = req.query;
    try{
        const role = await prisma.$queryRaw`
        SELECT role
        fROM "user"
        WHERE id = ${id}::UUID;
        `;
        
        let details;
        if(role && role[0]?.role === "Student"){
            details = await prisma.$queryRaw`
            SELECT amount,issued_by,issued_date,due_date,status,title
            from "invoice"
            WHERE user_id = ${id}::UUID;
            `;
        }else{
                details = await prisma.$queryRaw`
                SELECT amount,issued_by,issued_date,due_date,status,title
                from "invoice"
                WHERE user_id = ${id}::UUID;
                `;
        }
        let fulfillment = `Your invoices and details are as follows.\n\n`;
        if(!details || details.length === 0){
            res.status(500).json({error:`Sorry, we could not find any information for your invoice details.`});
            return `Sorry we could not find any information for your invoice details.`;
        }
        details.map((detail, index) => {
            fulfillment += `${index + 1}. Reason: ${detail.title}\nAmount: ${detail.amount}\nIssued By: ${detail.issued_by}\nIssued_date: ${new Date(detail.issued_date).toLocaleDateString()}\nDue Date: ${new Date(detail.due_date).toLocaleDateString()}\nStatus: ${detail.status}\n\n `
        })
        res.status(200).json({reply: fulfillment});
        return fulfillment;
    }

    catch(error){
        console.error("Error fetching bill details: "+error);
        return {error: "Failed to fetch bill details."};
    }
}