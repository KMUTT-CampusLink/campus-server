import prisma from "../../../core/db/prismaInstance.js"; // Adjust the path based on your project structure

// List of library announcements based on the provided data
const announcementsData = [
  {
    title: "New Books Arrival",
    description: "Our library is excited to announce the arrival of a new collection of both fiction and non-fiction books. This collection includes some of the latest bestsellers, as well as a variety of timeless classics across multiple genres. Come and explore our newest additions and find something that will capture your imagination, whether you’re into thrillers, romance, history, or science. There's something for everyone!"
  },
  {
    title: "Library Renovation",
    description: "We are pleased to share that our library will be undergoing a major renovation starting next month. These improvements will include expanding our reading areas, modernizing our facilities, and adding new technology for a better user experience. While we understand that the renovations may cause some inconvenience during this period, we are confident that the results will make your future visits even more enjoyable. Thank you for your patience and understanding."
  },
  {
    title: "Storytelling Session for Kids",
    description: "We are hosting an exciting storytelling session designed specifically for children aged 5 to 10. This fun-filled event will feature captivating tales and stories that spark imagination and creativity. Bring your little ones for a morning of adventure, laughter, and engagement with our talented storytellers. The session will be held this Saturday at 10:00 AM, and it’s a fantastic opportunity for children to develop their love for books and stories."
  },
  {
    title: "Author Meet & Greet",
    description: "Have you ever dreamed of meeting your favorite authors in person? Now's your chance! We are organizing an exclusive meet and greet event where you can interact with well-known authors, get your favorite books signed, and even ask questions during a lively Q&A session. Whether you're an aspiring writer or just an avid reader, this event is a fantastic opportunity to gain insights into the world of writing and publishing from the experts themselves."
  },
  {
    title: "Research Skills Workshop",
    description: "Our library is offering a special workshop on enhancing your research skills. This workshop is perfect for students, academics, or anyone interested in improving their ability to conduct thorough research. Learn how to navigate online databases, evaluate resources, and use different research tools effectively. Our expert librarians will guide you through various research techniques that will help you excel in both your academic and personal projects."
  },
  {
    title: "Film Screening: Classic Films",
    description: "Join us for an enjoyable screening of some of the most iconic classic films of all time. This event is perfect for movie lovers who want to revisit classic cinema or for those who are discovering these beloved films for the first time. Relax in our comfortable seating area and enjoy an afternoon filled with timeless entertainment. Plus, we will be providing snacks to make your experience even more enjoyable!"
  },
  {
    title: "Poetry Slam Event",
    description: "Are you a fan of spoken word and poetry? Come and enjoy a vibrant night of poetry at our upcoming poetry slam event. Local poets and performers will be taking the stage to share their original works, express their emotions, and captivate the audience with their powerful performances. Whether you are a poet yourself or simply enjoy listening to creative performances, this is a night you won't want to miss."
  },
  {
    title: "Children's Story Time",
    description: "We are thrilled to announce that our weekly children's story time is back! This event is ideal for children aged 3 to 7 and will feature enchanting tales that are sure to captivate young listeners. Our friendly storytellers will make the stories come alive through lively narration, gestures, and props. It’s a wonderful opportunity for children to foster a love for books, develop their listening skills, and enjoy a magical time at the library."
  },
  {
    title: "Teen Coding Workshop",
    description: "We are excited to offer a beginner-friendly coding workshop specifically designed for teenagers who are interested in learning programming. This hands-on workshop will introduce participants to the fundamentals of coding, including basic concepts, syntax, and creating simple projects. Our knowledgeable instructors will guide you through exercises that make coding fun and accessible, helping you kickstart your journey in the exciting world of programming."
  },
  {
    title: "Yoga for Stress Relief",
    description: "Join us for a rejuvenating yoga session focused on relieving stress and promoting mental well-being. This session is suitable for all levels, from beginners to experienced practitioners. Our certified yoga instructor will guide you through gentle poses and breathing exercises designed to reduce stress and improve flexibility. Take a moment for yourself to relax, unwind, and experience the benefits of yoga in a calm and supportive environment."
  }
];

// Function to add library announcements to the database
const addAnnouce = async () => {
  try {
    for (const announcement of announcementsData) {
      await prisma.library_announcement.create({
        data: announcement,
      });
      console.log(`Announcement "${announcement.title}" added to the database.`);
    }
  } catch (error) {
    console.error("Error adding announcements to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the function to add the announcements
addAnnouce();
