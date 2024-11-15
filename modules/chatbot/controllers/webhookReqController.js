import { clubListController } from "./webhookReq/clubs/clubListController.js";
import { clubMemberController } from "./webhookReq/clubs/clubMemberController.js";
import { libraryEventController } from "./webhookReq/library/libraryEventController.js";
import { programsListController } from "./webhookReq/programs/programsListController.js";
import { requirecourseController } from "./webhookReq/programs/requiredCourseController.js";
import { semesterEndController } from "./webhookReq/timeTables/semesterEndController.js";
import { semesterStartController } from "./webhookReq/timeTables/semesterStartController.js";
import { tutionFeeController } from "./webhookReq/programs/tutionFeeController.js";
import { professorController } from "./webhookReq/programs/professorController.js";

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
  console.log(pageName);
  let result;
  let paramsList = {};
  console.log(req.body.sessionInfo);
  if(pageName === "Fees"){
    const programName = req.body.sessionInfo.parameters.program.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim() + " Degree";
    result = await tutionFeeController(programName, degreeLevel);
    paramsList = {
      "program": null,
      "degreelevel": null,
    }
  }
  else if(pageName === "Programs List") {
    result = await programsListController();
  }else if(pageName === "Club List"){
    result = await clubListController();
  }else if(pageName === "EventList"){
    result = await libraryEventController();
  }else if(pageName === "Course"){
    const progName = req.body.sessionInfo.parameters.program.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim();
    result = await requirecourseController(progName, degreeLevel);
    paramsList = {
      "program": null,
      "degreelevel": null,
    };
  }else if(pageName === "Semester Starttime"){
    result = await semesterStartController();
  }else if(pageName === "Semester Endingtime"){
    result = await semesterEndController();
  }else if(pageName === "EventList"){
    result = await libraryEventController();
  }else if(pageName === "Member"){
    const clubName = req.body.sessionInfo.parameters.clubs.trim();
    result = await clubMemberController(clubName);
    paramsList = {
      "clubs": null,
    }
  }else if(pageName === "Professor"){
    console.log("lee professor");
    const courseName = req.body.sessionInfo.parameters.course.trim();
    result = await professorController(courseName);
    paramsList = {
      "course" : null,
    }
  }else if(pageName === "Search Book"){
    paramsList = {
      "books": null,
    }
  }
  console.log(result);
  res.json({
    "fulfillmentResponse": {
      "messages": [
        {
          "text": {
            "text": [result]
          }
        }
      ]
    },
    "sessionInfo": {
      "parameters": null
    }
  });
}