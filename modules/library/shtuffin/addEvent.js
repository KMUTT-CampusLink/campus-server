import prisma from "../../../core/db/prismaInstance.js"; // Adjust the path based on your project structure

// List of library events with columns matching the library_event table
const libraryEventsData = [
  {
    title: "Book Reading Event",
    description:
      "Join us for a delightful book reading session featuring renowned authors who will share their literary journeys and insights. This event promises to be a captivating experience as we dive into the stories behind their most popular works. Attendees will have the opportunity to engage in discussions, ask questions, and even participate in a book signing at the end of the session. Whether you're an avid reader or just curious about the world of literature, this event is perfect for you. Enjoy refreshments while mingling with fellow book lovers.",
    event_date: new Date("2024-10-15T14:00:00"),
    location: "Library",
  },
  {
    title: "Children's Story Time",
    description:
      "An interactive story session for children aged 4-10 filled with fun activities that ignite their imagination and love for reading. Our skilled storytellers will take children on magical adventures through enchanting tales that not only entertain but also teach valuable lessons. The session will include puppetry, songs, and interactive games that will keep the children engaged. Parents are encouraged to participate, making this a perfect family event where children can explore the wonders of literature together with their loved ones.",
    event_date: new Date("2024-11-05T10:00:00"),
    location: "S6: Children's Section",
  },
  {
    title: "Author Meet and Greet",
    description:
      "Meet your favorite author in person at this exclusive event where you can hear firsthand about their creative processes and inspirations. This is a unique opportunity to ask questions and gain insights into their writing techniques and experiences in the publishing world. Attendees will also enjoy a live reading from the author's latest work, followed by a Q&A session. Don't miss your chance to get your books signed and take a memorable photo with the author. This intimate gathering will be a celebration of literature and the stories that connect us all.",
    event_date: new Date("2024-12-01T16:30:00"),
    location: "S2: Conference Room A",
  },
  {
    title: "Writing Workshop",
    description:
      "A comprehensive writing workshop for aspiring writers of all levels. This workshop will cover various aspects of writing, from developing compelling characters to creating engaging plots. Led by experienced authors and writing instructors, participants will engage in hands-on activities, peer reviews, and receive constructive feedback on their work. The workshop will foster a supportive environment where you can express your creativity and develop your writing skills. Bring your drafts, ideas, and an open mind as we embark on this journey of literary exploration together.",
    event_date: new Date("2024-10-25T09:00:00"),
    location: "Lx: Community Room B",
  },
  {
    title: "Film Screening",
    description:
      "Join us for an unforgettable evening of classic films where we will screen some of the most beloved movies in cinematic history. Following each screening, there will be a lively discussion led by film enthusiasts, where you can share your thoughts and insights about the film’s themes, characters, and impact on culture. Whether you're a film buff or just looking for a fun night out, this event promises to be both entertaining and enlightening. Popcorn and refreshments will be provided, creating a perfect movie night experience.",
    event_date: new Date("2024-11-18T19:00:00"),
    location: "N10: Auditorium",
  },
  {
    title: "Poetry Slam",
    description:
      "Experience the power of spoken word at our Poetry Slam, where local poets perform their best works in a vibrant and supportive atmosphere. This event is not just a competition; it is a celebration of creativity and expression. Audience members will have the chance to vote for their favorite performances, adding an interactive element to the night. Join us for an evening filled with passion, talent, and the transformative magic of poetry. Whether you are a poet, an enthusiast, or simply curious, this event welcomes everyone to be part of a night to remember.",
    event_date: new Date("2024-08-20T18:00:00"),
    location: "Lx: Floor 12 - Outdoor Patio",
  },
  {
    title: "Photography Exhibit",
    description:
      "Explore a stunning collection of photographs showcasing the beauty of nature and urban landscapes. This exhibit features the work of local and international photographers who have captured breathtaking moments from around the world. The event will include a curator-led tour, offering insights into the stories behind each photograph. Attendees will also have the opportunity to meet the photographers and engage in discussions about the art of photography. Perfect for art enthusiasts and casual viewers alike, this exhibit promises to inspire and captivate.",
    event_date: new Date("2024-06-12T13:00:00"),
    location: "S15: Exhibition Hall",
  },
  {
    title: "Local History Lecture",
    description:
      "Join us for a fascinating lecture on the history of our city, from its early settlement to its present-day development. This event will be led by a distinguished historian who will share rare photographs, documents, and artifacts that highlight key moments in the city's past. Whether you're a history buff or simply curious about the place you call home, this event offers a unique opportunity to learn more about our community's roots and how it has evolved over time. Light refreshments will be served after the lecture.",
    event_date: new Date("2024-11-22T16:00:00"),
    location: "CB2: Lecture Hall 2",
  },
  {
    title: "Cooking with Books",
    description:
      "This unique event brings together book lovers and food enthusiasts for an interactive cooking demonstration inspired by famous literary works. Professional chefs will recreate iconic dishes from beloved novels and share their culinary techniques. Participants will have the chance to sample the dishes, take home recipes, and learn how to make literary-inspired meals in their own kitchens. Perfect for foodies and literature enthusiasts alike, this event is sure to be a feast for the senses!",
    event_date: new Date("2024-07-28T18:00:00"),
    location: "Lx: Floor 1 - Community Kitchen",
  },
  {
    title: "Holiday Craft Fair",
    description:
      "Get into the holiday spirit with our annual craft fair, where local artisans and crafters will showcase their handmade goods. From jewelry and pottery to holiday decorations and gift items, this fair offers a wide selection of unique products perfect for holiday shopping. There will be craft demonstrations throughout the day, as well as a raffle for a chance to win beautiful handcrafted items. Enjoy live music, seasonal treats, and plenty of holiday cheer while supporting local artists!",
    event_date: new Date("2024-12-05T10:00:00"),
    location: "S4: Community Center",
  },
];

// Function to add library events to the database
const addEvent = async () => {
  try {
    for (const event of libraryEventsData) {
      await prisma.library_event.create({
        data: event,
      });
      console.log(`Event "${event.title}" added to the database.`);
    }
  } catch (error) {
    console.error("Error adding events to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the function to add the events
addEvent();
