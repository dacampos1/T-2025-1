import type {
  Handler,
} from "aws-lambda";
import { getCustomers } from "../services/dynamo";

export const handler: Handler = async () => {
  
  return getCustomers();

};
