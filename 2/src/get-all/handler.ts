import type {
  Handler,
} from "aws-lambda";
import { getCustomers } from "../services/dynamo";

export const handler: Handler = async () => {
  try {
    const customers = await getCustomers();

    return {
      statusCode: 200,
      body: customers,
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Internal Server Error: ${error}` }),
    };
  }
}
