import type {
  Handler,
} from "aws-lambda";
import { customers } from "../bulk-create/handler";

export const handler: Handler = async () => {

  return customers;

};
