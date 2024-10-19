import prisma from "../../../core/db/prismaInstance.js"; 

const bookData = {
  category_id: 1001, 
  status: true,
  isbn: "978-1-234-56789-0",
  cover_image: "https://example.com/sample-book-cover.jpg",
  title: "The Adventures of Random Book",
  edition: 1,
  author: "John Doe",
  no_of_page: 350,
  publisher: "Random House",
  publish_date: new Date("2021-05-10"),
};

const addTestBook = async () => {
  try {
    await prisma.book.create({
      data: bookData,
    });
    console.log(`Book "${bookData.title}" added to the database.`);
  } catch (error) {
    console.error("Error adding book to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

addTestBook();
