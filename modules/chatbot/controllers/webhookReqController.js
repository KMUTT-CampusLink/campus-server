import { clubListController } from "./webhookReq/clubs/clubListController.js";
import { libraryEventController } from "./webhookReq/library/libraryEventController.js";
import { programsListController } from "./webhookReq/programs/programsListController.js";
import { requirecourseController } from "./webhookReq/programs/requiredCourseController.js";
import { tutionFeeController } from "./webhookReq/programs/tutionFeeController.js";

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
  // console.log(req.body);
  let result;
  if(pageName === "Fees"){
    const programName = req.body.sessionInfo.parameters.course.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim();
    result = await tutionFeeController(programName, degreeLevel);
  }
  else if(pageName === "Programs List") {
    result = await programsListController();
  }else if(pageName === "Club List"){
    result = await clubListController();
  }else if(pageName === "EventList"){
    result = await libraryEventController();
  }else if(pageName === "Course"){
    result = await requirecourseController();
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