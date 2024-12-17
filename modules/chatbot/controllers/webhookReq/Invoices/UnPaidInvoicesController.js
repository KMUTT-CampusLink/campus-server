import prisma from '../../../../../core/db/prismaInstance.js';

export const unPaidInvoicesController = async (id) => {
    try{
        const role = await prisma.$queryRaw`
        SELECT role
        fROM "user"
        WHERE id = ${id}::UUID;
        `;
        
        let details;
        let count;
        if(role && role[0]?.role === "Student"){
            details = await prisma.$queryRaw`
            SELECT amount,issued_by,issued_date,due_date,status,title
            from "invoice"
            WHERE user_id = ${id}::UUID
            AND status = 'Unpaid';
            `;

            count = await prisma.$queryRaw`
            SELECT count(*)
            from "invoice"
            WHERE user_id = ${id}::UUID
            AND status = 'Unpaid';
            `;
        }else{
                details = await prisma.$queryRaw`
                SELECT amount,issued_by,issued_date,due_date,status,title
                from "invoice"
                WHERE user_id = ${id}::UUID
                And status = 'Unpaid';
                `;

                count = await prisma.$queryRaw`
                SELECT count(*)
                from "invoice"
                WHERE user_id = ${id}::UUID
                AND status = 'Unpaid';
                `;
        }
        
        let fulfillment = null;
        if(count[0].count+"" !== "0"){
            fulfillment = `You have ${count[0].count} unpaid invoices and details are as follows.\n\n`;
            details.map((detail, index) => {
                fulfillment += `${index + 1}. Reason: ${detail.title}\nAmount: ${detail.amount}\nIssued By: ${detail.issued_by}\nIssued_date: ${new Date(detail.issued_date).toLocaleDateString()}\nDue Date: ${new Date(detail.due_date).toLocaleDateString()}\nStatus: ${detail.status}\n\n `
            })
            // res.status(200).json({reply: fulfillment});
            return fulfillment;
        }else{
            fulfillment = `You do not have any unpaid invoices.`;
            // res.status(500).json({error:`${fulfillment}`});
            return fulfillment;
        }

        // if(!details || details.length === 0){
        //     res.status(500).json({error:`Sorry, we could not find any information for your invoice details.`});
        //     return `Sorry we could not find any information for your unpaid invoice details.`;
        // }else{
        //     details.map((detail, index) => {
        //         fulfillment += `${index + 1}. Reason: ${detail.title}\nAmount: ${detail.amount}\nIssued By: ${detail.issued_by}\nIssued_date: ${new Date(detail.issued_date).toLocaleDateString()}\nDue Date: ${new Date(detail.due_date).toLocaleDateString()}\nStatus: ${detail.status}\n\n `
        //     })
        //     res.status(200).json({reply: fulfillment});
        // return fulfillment;
    }

    catch(error){
        console.error("Error fetching bill details: "+error);
        return "Internal Server Error.";
    }
}