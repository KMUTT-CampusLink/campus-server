import {SessionsClient} from "@google-cloud/dialogflow-cx";
import prisma from "../../../core/db/prismaInstance.js";

const client = new SessionsClient({
  credentials: {
    client_email: process.env.BOT_CLIENT_EMAIL,
    private_key: process.env.BOT_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
})
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
    const params = response.queryResult.parameters?.fields 
    ? Object.values(Object.entries(response.queryResult?.parameters?.fields).filter(([key]) => key !== 'bearerToken'))
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
          parameters = parameters.concat(p.stringValue);
        })
      }else parameters = "-";
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
    return {replyText: responseText, nextQuestions: nextQues};
  } catch (err) {
    console.error('Error during detectIntent: ', err);
    return {error: "Internal Server Error"};
  }
}

export {detectIntentText};