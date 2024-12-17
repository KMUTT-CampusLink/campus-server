const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

export const corsConfig = {
  origin: (origin, callback) => {
    // !origin means the request is from the Dialogflow agent
    if (!origin || (origin && allowedOrigins.indexOf(origin) !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  optionsSuccessStatus: 200,
  credentials: true,
};
