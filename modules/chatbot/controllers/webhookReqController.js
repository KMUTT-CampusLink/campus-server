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
import { unPaidInvoicesController } from "./webhookReq/Invoices/UnPaidInvoicesController.js";
import { professorContactController } from "./webhookReq/programs/professorContactController.js";
import { availableParkingSlotController } from "./webhookReq/parking/availableParkingSlot.js";
import { registeredCourseController } from "./webhookReq/student/registeredCourseController.js";
import { transportationBookingController } from "./webhookReq/bookings/transportationBookingController.js";
import { lostAndFoundController } from "./webhookReq/building and secruity/lostAndFoundController.js";

let globalParameters = {};
let trips_data = [];
let book_data = [];

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
    book_data = await checkBookController(title);
    if(!book_data || book_data.length === 0){
      result = `I'm sorry. The book "${title}" is not available at the library at the moment.`
    }else result = "book";
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
  }else if(pageName === "Unpaid Invoices"){
    const id = req.user.id;
    result = await unPaidInvoicesController(id);
  }else if(pageName === "Contact"){
    const courseName = req.body.sessionInfo.parameters.course.trim();
    const sectionName = req.body.sessionInfo.parameters.section.trim();
    result = await professorContactController(courseName, sectionName);
    parameters = {
      "course": null,
      "section": null
    }
  }else if(pageName === "Slots"){
    const building = req.body.sessionInfo.parameters.building.trim();
    const floor = req.body.sessionInfo.parameters.floor.trim();
    result = await availableParkingSlotController(building, floor);
    parameters = {
      "building": null,
      "floor": null,
    }
  }else if(pageName === "Registered Course"){
    const studId = req.user.studentId;
    result = await registeredCourseController(studId);
  }else if(pageName === "Transportation Trips"){
    const startStop = req.body.sessionInfo.parameters.start.trim();
    const endStop = req.body.sessionInfo.parameters.stop.trim();
    const day = req.body.sessionInfo.parameters.day.trim();
    trips_data = await transportationBookingController(startStop, endStop, day);
    parameters = {
      "start": null,
      "stop": null,
      "day": null,
    }
    if(!trips_data || trips_data.length === 0){
      result = `I'm sorry. There is no route available from ${startStop} to ${endStop}.`
    }else result = "trip";
  }else if(pageName === "Lost Found"){
    const status = req.body.sessionInfo.parameters.lostandfound.trim();
    result = await lostAndFoundController(status);
    parameters = {
      "status" : null,
    }
  }
  // console.log(result);
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
      parameters,
    }
  });
}

export {globalParameters, trips_data, book_data}