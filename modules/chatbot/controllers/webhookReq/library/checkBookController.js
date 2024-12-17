import prisma from "../../../../../core/db/prismaInstance.js";

export const checkBookController = async (title) => {
    try {
        const book = await prisma.$queryRaw`
        SELECT b.*, bd2.id AS bdid
        FROM "book" AS b
        JOIN "book_duplicate" AS bd2
          ON b.id = bd2.book_id
        WHERE b.title = ${title}
          AND b.status = true
          AND bd2.status = true
        ORDER BY bd2.id
        LIMIT 1;
        `;
    
        // console.log(book);
        return book;
        // if (book.length > 0) {
        //     // res.status(200).json({ message: `Yes, the book titled "${book[0].title}", edition ${book[0].edition}: written by ${book.author}, is available at the library.` });
        // //    return `Yes, the book titled "${book[0].title}", edition ${book[0].edition}: written by ${book[0].author}, is available at the library.\nDescription: "${book[0].description}"\n
        // //    Do you want to reserve the book?`;
        //     return book;
        // } else {
        // //    res.status(404).json({ message: 'There is no such book available at the library.' });
        //     return book;
        // }
    } catch (error) {
        console.error('Error fetching book availability'+ error);
    //    res.status(500).json({ error: 'Failed to fetch book avalibility' });
        return "Internal Server Error";
    }
};