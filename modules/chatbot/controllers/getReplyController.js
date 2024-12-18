import { SessionsClient } from "@google-cloud/dialogflow-cx";
import prisma from "../../../core/db/prismaInstance.js";
import { globalParameters, trips_data, book_data} from "./webhookReqController.js";

const client = new SessionsClient({
  credentials: {
    client_email: process.env.BOT_CLIENT_EMAIL,
    private_key: process.env.BOT_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
});
let prevPage = "Start Page";
let parameters = "-";
const detectIntentText = async(projectId, inputText, sessionId, bearerToken) => {

  const location = process.env.BOT_LOCATION; // or the specific location of your agent
  const agentId = process.env.BOT_AGENT_ID;
  
  const sessionPath = client.projectLocationAgentSessionPath(
    projectId, location, agentId, sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: inputText,
      },
      languageCode: 'en',
    },
    queryParams: {
      parameters: {
        fields: {
          bearerToken: { stringValue: bearerToken },
        },
      }
    }
  }; 

  try {
    const [response] = await client.detectIntent(request);
    const globalparams = { ...globalParameters };
    const params = globalparams
    ? Object.values(Object.entries(globalparams).filter(([key]) => key !== 'bearerToken'))
    : [];
    const responseMessages = response.queryResult.responseMessages;
    let responseText = '';
    // Loop through the responseMessages to find the text message
    responseMessages.forEach(message => {
      if (message.text && message.text.text) {
        responseText += message.text.text.join('\n'); // Join multiple parts of the text
      }
    });
    let nextQues = [];
    if(response.queryResult.match.matchType !== 'NO_MATCH' && response.queryResult.currentPage.displayName !== 'Start Page'){
      if(prevPage != response.queryResult.currentPage.displayName){
        await prisma.next_question.upsert({
          where: {
            page_name_params_next_question: {
              page_name: prevPage,
              params: parameters,
              next_question: inputText
            }
          },
          update: { count : {increment: 1}},
          create: {page_name: prevPage, params: parameters, next_question: inputText, count: 1},
        })
      }
      prevPage = response.queryResult.currentPage.displayName;
      parameters = "";
      if(params.length > 0){
        params.map((p) => {
          if(p[1]) parameters = parameters.concat(p[1]);
        })
      } else parameters = "-";
      if(parameters.length === 0) parameters = "-";
      // console.log("pars " + parameters);
      await prisma.page_req_count.upsert({
        where: {
          page_name_params:{
            page_name: prevPage,
            params: parameters
          }
        },
        update: { count: { increment: 1 } },
        create: { page_name: prevPage, params: parameters, count: 1 }, 
      });  
    }
    if(prevPage !== 'Start Page'){
      try{
        nextQues = await prisma.next_question.findMany({
            where: {
                page_name: prevPage,
                params: parameters,
            },
            select: {
              next_question: true,
            },
            orderBy: {
                count: "desc",
            },
            take: 3,
          });
      }catch(error){
          console.error("Error fetching next questions: " + error);
      }
    }

    // Function to parse trips_data
    function parseTripsData(tripsDataParam) {
      if (!tripsDataParam || !tripsDataParam.listValue) {
        // console.log("trips_data is undefined or invalid");
        return [];
      }
    
      return tripsDataParam.listValue.values.map(trip => {
        const fields = trip.structValue.fields;
    
        return {
          id: fields.id?.numberValue || null,
          driver_id: fields.driver_id?.numberValue || null,
          vehicle_id: fields.vehicle_id?.numberValue || null,
          trip_date: fields.trip_date?.stringValue || null,
          trip_schedule: {
            day: fields.trip_schedule?.structValue?.fields?.day?.stringValue || null,
            start_time: fields.trip_schedule?.structValue?.fields?.start_time?.stringValue || null,
            end_time: fields.trip_schedule?.structValue?.fields?.end_time?.stringValue || null,
          },
        };
      });
    }
    
// Parsing trips_data
  const trips = response.queryResult.parameters.fields.trips_data;
  const cleanTripsData = trips ? parseTripsData(response.queryResult.parameters.fields.trips_data) : [];

// Function to parse book_data
function parseBookData(bookDataParam) {
  if (!bookDataParam || !bookDataParam.listValue) {
    // console.log("book_data is undefined or invalid");
    return [];
  }

  return bookDataParam.listValue.values.map(book => {
    const fields = book.structValue.fields;

    return {
      id: fields.id?.numberValue || null,
      category_id: fields.category_id?.numberValue || null,
      status: fields.status?.boolValue || null,
      isbn: fields.isbn?.stringValue || null,
      cover_image: fields.cover_image?.stringValue || null,
      title: fields.title?.stringValue || null,
      edition: fields.edition?.numberValue || null,
      author: fields.author?.stringValue || null,
      no_of_page: fields.no_of_page?.numberValue || null,
      publisher: fields.publisher?.stringValue || null,
      publish_date: fields.publish_date?.stringValue || null,
      created_at: fields.created_at?.stringValue || null,
      updated_at: fields.updated_at?.stringValue || null,
      description: fields.description?.stringValue || null,
      bdid: fields.bdid?.numberValue || null,
    };
  });
}

// Parsing book_data
const cleanBookData = parseBookData(response.queryResult.parameters.fields.book_data);

// console.log("Clean Book Data:", cleanBookData);

// console.log("Clean Trips Data:", cleanTripsData);

    return {replyText: responseText, nextQuestions: nextQues, trips: cleanTripsData, book: cleanBookData};
  } catch (err) {
    console.error('Error during detectIntent: ', err);
    return {error: "Internal Server Error"};
  }
}

export { detectIntentText };

