import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";


export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    if(JSON.parse(event.body||'') === null){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Invalid JSON` }),
      };
    }
    const client = new SQSClient({});
    const command = new SendMessageCommand({
      QueueUrl:  process.env.QUEUE_URL,
      DelaySeconds: 10,
      MessageBody:
       JSON.stringify((event.body))
    });
  
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Customers added successfully` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Internal Server Error: ${error}` }),
    };
  }
};
