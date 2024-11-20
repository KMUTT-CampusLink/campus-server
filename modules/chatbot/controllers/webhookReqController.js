import { clubListController } from "./webhookReq/clubs/clubListController.js";
import { clubMemberController } from "./webhookReq/clubs/clubMemberController.js";
import { libraryEventController } from "./webhookReq/library/libraryEventController.js";
import { programsListController } from "./webhookReq/programs/programsListController.js";
import { requirecourseController } from "./webhookReq/programs/requiredCourseController.js";
import { semesterEndController } from "./webhookReq/timeTables/semesterEndController.js";
import { semesterStartController } from "./webhookReq/timeTables/semesterStartController.js";
import { tutionFeeController } from "./webhookReq/programs/tutionFeeController.js";
import { professorController } from "./webhookReq/programs/professorController.js";
import { examScoreController } from "./webhookReq/student/examScoreController.js";
import { futureExamController } from "./webhookReq/student/futureExamController.js";
import { checkBookController } from "./webhookReq/library/checkBookController.js";
import { courseDurationController } from "./webhookReq/programs/courseDurationController.js";

let globalParameters = {};

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
  console.log(pageName);
  let result;
  globalParameters = req.body.sessionInfo.parameters;
  console.log(globalParameters)
  let parameters = {};
  if(pageName === "Fees"){
    const programName = req.body.sessionInfo.parameters.program.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim() + " Degree";
    result = await tutionFeeController(programName, degreeLevel);
    parameters = {
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
    parameters = {
      "program": null,
      "degreelevel": null,
    };
  }else if(pageName === "Semester Endingtime"){
    const stuId = req.user.studentId;
    result = await semesterEndController(stuId);
  }else if(pageName === "EventList"){
    result = await libraryEventController();
  }else if(pageName === "Member"){
    const clubName = req.body.sessionInfo.parameters.clubs.trim();
    result = await clubMemberController(clubName);
    parameters = {
      "clubs": null,
    }
  }else if(pageName === "Professor"){
    const courseName = req.body.sessionInfo.parameters.course.trim();
    result = await professorController(courseName);
    parameters = {
      "course" : null,
    }
  }else if(pageName === "Score"){
    const studentId = req.user.studentId;
    const examTitle = req.body.sessionInfo.parameters.course.trim();
    result = await examScoreController(studentId, examTitle);
    parameters = {
      "course": null,
    }
  }else if(pageName === "Exam"){
    const studentId = req.user.studentId;
    const examTitle = req.body.sessionInfo.parameters.course.trim();
    result = await futureExamController(studentId, examTitle);
    parameters = {
      "course": null,
    }
  }else if(pageName === "Search Book"){
    const title = req.body.sessionInfo.parameters.books.trim();
    result = await checkBookController(title);
    parameters = {
      "books": null,
    }
  }else if(pageName === "Course"){
    const progName = req.body.sessionInfo.parameters.program.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim();
    result = await requirecourseController(progName, degreeLevel);
    parameters = {
      "program": null,
      "degreelevel": null,
    }
  }else if(pageName === "Semester Starttime"){
    const stuId = req.user.studentId;
    result = await semesterStartController(stuId);
  }else if(pageName === "Duration"){
    const programName = req.body.sessionInfo.parameters.program.trim();
    const degreeLevel = req.body.sessionInfo.parameters.degreelevel.trim();
    result = await courseDurationController(programName, degreeLevel);
    parameters = {
      "program": null,
      "degreelevel": null,
    }
  }
  // console.log(parameters);
  res.json({
    "fulfillmentResponse": {
      "messages": [
        {
          "text": {
            "text": [result ? result : "I'm sorry. I do not have that information right now."]
          }
        }
      ]
    },
    "sessionInfo": {
      parameters
    }
  });
}

export {globalParameters}