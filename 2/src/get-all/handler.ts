import type {
  Handler,
} from "aws-lambda";
import { getCustomers } from "../services/dynamo";

export const handler: Handler = async () => {
  const customers = await getCustomers();

  return {
    statusCode: 200,
    body: customers,
  };
};
