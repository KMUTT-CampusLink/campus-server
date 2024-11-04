import { SessionsClient } from "@google-cloud/dialogflow-cx";

const client = new SessionsClient({
  credentials: {
    client_email: process.env.BOT_CLIENT_EMAIL,
    private_key: process.env.BOT_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
})

const detectIntentText = async (projectId, inputText, sessionId) => {
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
  };

  try {
    const [response] = await client.detectIntent(request);
    // console.log(response.queryResult.responseMessages);

    const responseMessages = response.queryResult.responseMessages;
    let responseText = '';

    // Loop through the responseMessages to find the text message
    responseMessages.forEach(message => {
      if (message.text && message.text.text) {
        responseText += message.text.text.join('\n'); // Join multiple parts of the text
      }
    });

    // console.log('Agent Response:', responseText);
    return responseText;
  } catch (err) {
    console.error('Error during detectIntent: ', err);
  }
}

export { detectIntentText };