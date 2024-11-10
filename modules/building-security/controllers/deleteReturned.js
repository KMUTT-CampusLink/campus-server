// import prisma from "../../../core/db/prismaInstance.js"; // Adjust path as needed

// // Function to delete "Returned" items older than 1 minute (for testing)
// export const deleteReturned = async () => {
//     console.log("Checking for 'Returned' items older than 1 minute to delete...");

//     try {
//         // Calculate the date and time 1 minute ago in Thailand time
//         const getThailandTime = () => {
//             const now = new Date();
//             const thailandTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours for ICT
//             thailandTime.setMinutes(thailandTime.getMinutes() - 1); // Subtract 1 minute
//             return thailandTime;
//         };

//         // Delete records where the status is "Returned" and updated_at is older than 1 minute
//         const deletedRecords = await prisma.lost_and_found.deleteMany({
//             where: {
//                 status: "Returned",
//                 updated_at: {
//                     lt: getThailandTime(), // Checks if `updated_at` is older than 1 minute
//                 },
//             },
//         });

//         console.log(`Deleted ${deletedRecords.count} items with status "Returned" older than 1 minute.`);
//     } catch (error) {
//         console.error("Error deleting old 'Returned' items:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// };

// // Run the function every 10 seconds to check for items to delete (for testing)
// setInterval(deleteReturned, 1000 * 10); // Runs every 10 seconds
