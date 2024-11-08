import { clubListController } from "./webhookReq/clubs/clubListController.js";
import { clubMemberController } from "./webhookReq/clubs/clubMemberController.js";
import { libraryEventController } from "./webhookReq/library/libraryEventController.js";
import { programsListController } from "./webhookReq/programs/programsListController.js";
import { requirecourseController } from "./webhookReq/programs/requiredCourseController.js";
import { semesterEndController } from "./webhookReq/timeTables/semesterEndController.js";
import { semesterStartController } from "./webhookReq/timeTables/semesterStartController.js";

export const webhookReqController = async(req, res) => {
  console.log(req.body)
  const pageName = req.body.pageInfo.displayName;
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
  }else if(pageName === "Semester Starttime"){
    result = await semesterStartController();
  }else if(pageName === "Semester Endingtime"){
    result = await semesterEndController();
  }else if(pageName === "EventList"){
    result = await libraryEventController();
  }else if(pageName === "Member"){
    const clubName = req.body.sessionInfo.parameters.clubs.trim();
    result = await clubMemberController(clubName);
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