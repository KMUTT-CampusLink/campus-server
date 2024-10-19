import  prisma  from '../../../core/db/prismaInstance.js'

const getAllInvoice = async (req, res) => {
  try {
    const showAllInvoice = await prisma.invoice.$queryRaw`
      SELECT 
        inv.id,
        inv.issued_by,
        inv.issued_date,
        inv.paid_date,
        inv.amount,
        inv.title,
        inv.title,
        inv.status,
        inv.created_at,
        inv.updated_at
      FROM 
        invoice AS inv
      WHERE 
        inv.user_id = ${userId}
      ORDER BY 
        inv.updated_at;
    `;
    res.json(showAllInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Invoie Data' });
  }
};

export { getAllInvoice };