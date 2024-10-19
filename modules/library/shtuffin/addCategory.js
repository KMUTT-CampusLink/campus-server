import prisma from "../../../core/db/prismaInstance.js"; // Adjust this path based on your project structure

const categories = [
  {
    title: "Fiction",
    description: "A literary work based on the imagination and not necessarily on fact.",
  },
  {
    title: "History",
    description: "Books that document historical events or analyze their significance.",
  },
  {
    title: "Science",
    description: "Books that explore the natural and physical world through observation and experimentation.",
  },
  {
    title: "Technology",
    description: "Books that delve into the application of scientific knowledge for practical purposes.",
  },
  {
    title: "Art",
    description: "Books that focus on various forms of creative expression and visual aesthetics.",
  },
  {
    title: "Health",
    description: "Books that explore physical and mental well-being, medical practices, and health advice.",
  },
];

const addCategory = async () => {
  try {
    for (const category of categories) {
      await prisma.category.create({
        data: {
          title: category.title,
          description: category.description,
        },
      });
      console.log(`Category "${category.title}" added.`);
    }
  } catch (error) {
    console.error("Error adding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
};

addCategory();
