import { programsListController } from "./webhookReq/programs/programsListController.js";
import { tutionFeeController } from "./webhookReq/programs/tutionFeeController.js";

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
  // console.log(req.body);
  let result;
  if(pageName === "Fees"){
    const programName = req.body.sessionInfo.parameters.course.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim();
    params = programName.concat(" ").concat(degreeLevel);
    result = await tutionFeeController(programName, degreeLevel);
  }
  else if(pageName === "Programs List") {
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