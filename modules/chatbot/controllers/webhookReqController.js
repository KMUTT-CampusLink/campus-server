import { programsListController } from "./webhookReq/programs/programsListController.js";
import { tutionFeeController } from "./webhookReq/programs/tutionFeeController.js";

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
//   console.log(pageName);
  let result;
  if(pageName === "Fees"){
    const programName = req.body.sessionInfo.parameters.course.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degree_level.trim();
    result = await tutionFeeController(programName, degreeLevel);
  }
  else if(intentName === "Programs List") {
    result = await programsListController();
  }
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