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
import { libraryAnnouncementController } from "./webhookReq/library/libraryAnnouncementController.js";
import { allaboutCourseController } from "./webhookReq/programs/allaboutCourseController.js";
import { allaboutClubController } from "./webhookReq/clubs/allaboutClubController.js";
import { clubAnnouncementController } from "./webhookReq/clubs/clubAnnouncementController.js";
import { buildingContactController } from "./webhookReq/building and secruity/buildingContactController.js";
import { invoiceDetailController } from "./webhookReq/Invoices/invoiceDetailController.js";

let globalParameters = {};

export const webhookReqController = async(req, res) => {
  const pageName = req.body.pageInfo.displayName;
  // console.log(pageName);
  let result;
  globalParameters = req.body.sessionInfo.parameters;
  // console.log(globalParameters)
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
    const clubName = req.body.sessionInfo.parameters.club.trim();
    result = await clubMemberController(clubName);
    parameters = {
      "clubs": null,
      "club": null,
    }
  }else if(pageName === "Professor"){
    const courseName = req.body.sessionInfo.parameters.course.trim();
    result = await professorController(courseName);
    parameters = {
      "course" : null,
    }
  }else if(pageName === "Score"){
    const studentId = req.user.studentId;
    const courseName = req.body.sessionInfo.parameters.course.trim();
    result = await examScoreController(studentId, courseName);
    parameters = {
      "course": null,
    }
  }else if(pageName === "Future Exam"){
    const studentId = req.user.studentId;
    result = await futureExamController(studentId);
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
  }else if(pageName === "RecentAnnouncement"){
    result = await libraryAnnouncementController();
  }else if(pageName === "All Course"){
    const courseName = req.body.sessionInfo.parameters.course.trim();
    result = await allaboutCourseController(courseName);
    parameters = {
      "course": null,
    }
  }else if(pageName === "All Club"){
    const clubName = req.body.sessionInfo.parameters.club.trim();
    result = await allaboutClubController(clubName);
    parameters = {
      "club": null,
    }
  }else if(pageName === "Club Event Announcement"){
    const clubName = req.body.sessionInfo.parameters.club.trim();
    result = await clubAnnouncementController(clubName);
    parameters = {
      "club": null,
    }
  }else if(pageName === "Building Contact"){
    const buildingName = req.body.sessionInfo.parameters.building.trim();
    result = await buildingContactController(buildingName);
    parameters = {
      "building": null,
    }
  }else if(pageName === "Invoice All"){
    const id = req.user.id;
    result = await invoiceDetailController(id);
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