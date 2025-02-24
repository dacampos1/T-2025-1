import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import axios from 'axios';
import * as  axiosRetry from 'retry-axios';

axios.defaults.raxConfig = {
  retry: 5,
  noResponseRetries: 2,
  statusCodesToRetry: [ [503]],
};

axiosRetry.attach(axios);

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  const URL = `${process.env.LAMBDA_URL}/api/bulk-create`; ;
  try {
    const BASE_INDEX = event.body ? JSON.parse(event.body).currentIdNumber : 0;
    const payloads = getRandomPayloads(BASE_INDEX);
    
    const paralellRequests = payloads.map(async (payload) => {
      const response = await axios.post(URL, payload);
      return response;
    }
  );
  const response = await Promise.allSettled(paralellRequests);
  const payloadsAndResponses = payloads.map((payload, index) => {
    if (response[index].status !== 'fulfilled') {
      const responseRejected = response[index] as PromiseRejectedResult;
      return {
        status: 'rejected',
        payload,
        response: responseRejected.reason.message
      };
    }
    const responseFulfilled = response[index] as PromiseFulfilledResult<any>;
    return {
      payload,
      status: 'fulfilled',
      response: responseFulfilled.value.data
    };
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Requests generated successfully`, payloadsAndResponses }),
  };
} catch (error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: `Internal Server Error: ${error}` }),
  };
}
};

const getRandomPayloads = (currentIdNumber: number) => {
  const NAMES = ['Leia', "Sadie", "Jose", "Sara", "Frank", "Dewey", "Tomas", "Joel", "Lukas", "Carlos"];
  const LAST_NAMES = ["Liberty", "Ray", "Harrison", "Ronan", "Drew", "Powell", "Larsen", "Chan", "Anderson"];
  const randomNumberOfParallelRequests = Math.floor(Math.random() * 5) + 2;
  
  let idCounter = currentIdNumber;
  
  const payloads = Array.from({ length: randomNumberOfParallelRequests }, (_) => {
    const randomNumberOfCustomers= Math.floor(Math.random() * 5) + 2;
    const customers = Array.from({ length: randomNumberOfCustomers }, () => ({
      firstName: NAMES[Math.floor(Math.random() * NAMES.length)],
      lastName: LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)],
      age: Math.floor(Math.random() * 80) + 10,
      id: idCounter++
    }));
    return customers;
  });
  return payloads;
};
