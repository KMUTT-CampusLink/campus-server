import prisma from "../../../../../core/db/prismaInstance.js";

export const checkBookController = async (title) => {
    try {
           const book = await prisma.$queryRaw`
            SELECT title, edition, author
            FROM "book"
            WHERE title = ${title} and status = true
        `;

        if (book.length > 0) {
            // res.status(200).json({ message: `Yes, the book titled "${book[0].title}", edition ${book[0].edition}: written by ${book.author}, is available at the library.` });
           return `Yes, the book titled "${book[0].title}", edition ${book[0].edition}: written by ${book[0].author}, is available at the library.`;
        } else {
        //    res.status(404).json({ message: 'There is no such book available at the library.' });
            return `There is no such book available at the library right now.`
        }
    } catch (error) {
        console.error('Error fetching book availability'+ error);
    //    res.status(500).json({ error: 'Failed to fetch book avalibility' });
        return {error: "Failed to fetch book avalibility"};
    }
};