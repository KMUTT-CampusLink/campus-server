const allowedOrigins = ["http://localhost:5173/", "http://localhost:3000/"];

export const corsConfig = {
  origin: (origin, callback) => {
    // if (origin && allowedOrigins.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }

    // allow all origins just for dev environment
    callback(null, true);
  },
  allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  optionsSuccessStatus: 200,
  credentials: true,
};
