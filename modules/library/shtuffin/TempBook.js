// Adding 10 more books to the existing bookData for the History category (category_id: 1002)
const newBooks = [
  {
    category_id: 1002,
    isbn: "978-0198853031",
    cover_image: "https://m.media-amazon.com/images/I/91LTxNH1d5L._SY466_.jpg",
    title: "The Napoleonic Wars: A Global History",
    edition: 1,
    author: "Alexander Mikaberidze",
    no_of_page: 960,
    publisher: "Oxford University Press",
    publish_date: new Date("2021-02-23"),
    description:
      "A comprehensive look at the Napoleonic Wars from a global perspective, exploring the battles, the people, and the cultures affected by this worldwide conflict.",
  },
  {
    category_id: 1002,
    isbn: "978-0525559474",
    cover_image: "https://m.media-amazon.com/images/I/71tV8VG0aEL._SY466_.jpg",
    title: "The Anarchy: The Relentless Rise of the East India Company",
    edition: 1,
    author: "William Dalrymple",
    no_of_page: 576,
    publisher: "Bloomsbury Publishing",
    publish_date: new Date("2019-09-10"),
    description:
      "A compelling history of the East India Company and its transformation from a small trading company into a powerful, imperial force that shaped the destiny of India.",
  },
  {
    category_id: 1002,
    isbn: "978-1501191886",
    cover_image: "https://m.media-amazon.com/images/I/81A8E6RCEDL._SY466_.jpg",
    title:
      "The Splendid and the Vile: A Saga of Churchill, Family, and Defiance During the Blitz",
    edition: 1,
    author: "Erik Larson",
    no_of_page: 608,
    publisher: "Crown",
    publish_date: new Date("2020-02-25"),
    description:
      "A vivid and intimate look at Winston Churchill and London during the Blitz, showcasing the resilience of a city and its people in the face of adversity.",
  },
  {
    category_id: 1002,
    isbn: "978-1400078794",
    cover_image: "https://m.media-amazon.com/images/I/81evElZff5L._SY466_.jpg",
    title: "Guns, Germs, and Steel: The Fates of Human Societies",
    edition: 1,
    author: "Jared Diamond",
    no_of_page: 528,
    publisher: "W. W. Norton & Company",
    publish_date: new Date("1999-04-20"),
    description:
      "Jared Diamond explores the environmental and geographical factors that shaped the fates of human societies around the world.",
  },
  {
    category_id: 1002,
    isbn: "978-1982138325",
    cover_image: "https://m.media-amazon.com/images/I/91OeNFlSDwL._SY466_.jpg",
    title: "Caste: The Origins of Our Discontents",
    edition: 1,
    author: "Isabel Wilkerson",
    no_of_page: 496,
    publisher: "Random House",
    publish_date: new Date("2020-08-04"),
    description:
      "Isabel Wilkerson examines the hidden caste system in America, revealing how our lives are still defined by a rigid hierarchy of human divisions.",
  },
  {
    category_id: 1002,
    isbn: "978-0393356180",
    cover_image: "https://m.media-amazon.com/images/I/71eL4aJlZzL._SY466_.jpg",
    title: "Sapiens: A Brief History of Humankind",
    edition: 1,
    author: "Yuval Noah Harari",
    no_of_page: 512,
    publisher: "Harper Perennial",
    publish_date: new Date("2018-05-15"),
    description:
      "A thought-provoking exploration of the history of humankind, tracing our evolution from the Stone Age to the present day.",
  },
  {
    category_id: 1002,
    isbn: "978-0525436430",
    cover_image: "https://m.media-amazon.com/images/I/81GqtNbs+PL._SY466_.jpg",
    title: "The Silk Roads: A New History of the World",
    edition: 1,
    author: "Peter Frankopan",
    no_of_page: 672,
    publisher: "Vintage",
    publish_date: new Date("2017-03-07"),
    description:
      "Peter Frankopan provides a new perspective on world history, highlighting the importance of the Silk Roads in shaping the modern world.",
  },
  {
    category_id: 1002,
    isbn: "978-0812985405",
    cover_image: "https://m.media-amazon.com/images/I/71DwzFzofmL._SY466_.jpg",
    title: "The Wright Brothers",
    edition: 1,
    author: "David McCullough",
    no_of_page: 336,
    publisher: "Simon & Schuster",
    publish_date: new Date("2015-05-05"),
    description:
      "A detailed biography of Wilbur and Orville Wright, the brothers who pioneered the invention of the airplane and revolutionized human flight.",
  },
  {
    category_id: 1002,
    isbn: "978-0062316110",
    cover_image: "https://m.media-amazon.com/images/I/71-XcBf6EoL._SY466_.jpg",
    title:
      "The Pioneers: The Heroic Story of the Settlers Who Brought the American Ideal West",
    edition: 1,
    author: "David McCullough",
    no_of_page: 352,
    publisher: "Simon & Schuster",
    publish_date: new Date("2019-05-07"),
    description:
      "David McCullough tells the story of the courageous settlers who journeyed westward to create the American frontier.",
  },
  {
    category_id: 1002,
    isbn: "978-0670024795",
    cover_image: "https://m.media-amazon.com/images/I/71+je8FXdaL._SY466_.jpg",
    title: "The Greater Journey: Americans in Paris",
    edition: 1,
    author: "David McCullough",
    no_of_page: 576,
    publisher: "Simon & Schuster",
    publish_date: new Date("2011-05-24"),
    description:
      "A fascinating account of the adventurous American artists, writers, doctors, and others who traveled to Paris between 1830 and 1900.",
  },
];

// Adding the new books to the existing bookData
bookData.push(...newBooks);

// Run the function to add all the books, including the new ones
addAllBook();
