import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import axios from 'axios';

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
  await Promise.allSettled(paralellRequests);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Requests generated successfully`, payloads }),
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
