import prisma from "../../../../../core/db/prismaInstance.js";

export const programsListController = async () => {
  try {
    const programs = await prisma.$queryRaw`
            SELECT name, degree_level
            FROM "program";
        `;
    let fulfillment = "Our university offers the following programs. \n";
    programs.map((program, index) => {
      fulfillment += `${index + 1}. ${program.name} (${
        program.degree_level
      }) \n`;
    });
    return fulfillment;
  } catch (error) {
    console.error("Error fetching programs: " + error);
    return { error: "Failed to fetch programs" };
  }
};
