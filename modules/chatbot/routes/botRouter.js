import { Router } from "express";

// import your logics from controllers here
import { programsListController } from "../controllers/programsListController.js";
import { faqController } from "../controllers/faqController.js";
import { detectIntentText } from "../controllers/getReplyController.js";

const botRouter = Router();

botRouter.post("/webhook", async (req, res) => {
  const intentName = req.body.intentInfo.displayName;
  console.log(intentName);
  if(intentName === "program.list") {
    const result = await programsListController();
    // console.log(result);
    res.json({
      "fulfillmentResponse": {
        "messages": [
          {
            "text": {
              "text": [result]
            }
          }
        ]
      }
    });
  }
});

botRouter.post("/message", async(req, res) => {
  const inputText = req.body.message;
  const sessionId = req.body.sessionId;
  const projectId = process.env.BOT_PROJECT_ID;
  // console.log(req.body);
  const reply = await detectIntentText(projectId, inputText, sessionId);
  res.json({replyMessage: reply});
});
botRouter.get("/faqs", faqController);



// const app = express();

// app.use(bodyParser.json());
// const botRouter = Router();

// app.post('/webhook', async (req, res) => {
//   console.log(true);
//   console.log(JSON.stringify(req.body));
// });

// botRouter.get("/", (req, res) => {
//   return res.send("Bot Astra");
// });
// botRouter.use("/faqs", faqRouter);
export { botRouter };

