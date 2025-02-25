import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, SQSEvent } from 'aws-lambda';
import { Customer, getCustomers, putCustomers } from '../../services/dynamo';


export const handler = async (event: SQSEvent) => {
  try {
    const customers = await getCustomers();
    const newCustomers: Customer[] = JSON.parse(JSON.parse(event.Records[0].body)) ||[];
    for (const customer of newCustomers) {
      if (!customer.firstName || !customer.lastName || !customer.age || customer.id === undefined) {
        console.log('Customer is missing required fields', customer);
        continue;
      }

      if (customer.age <= 18) {
        console.log('Customer must be above 18 years old', customer);
        continue;
      }
      const customerAlreadyExists = customers.find(
        (existingCustomer) => existingCustomer.id === customer.id
      );

      if (customerAlreadyExists) {
        console.log('Customer already exists', customer);
        continue;
      }

      const index = binarySearch(customers, customer);
      customers.splice(index, 0, customer);
    };
    await putCustomers(customers);
    console.log('Customers added successfully', customers);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Customers added successfully`, customers }),
    };
  } catch (error) {
    console.error('Unexpected error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Internal Server Error: ${error}` }),
    };
  }
};

function binarySearch(customers: Customer[], customer: Customer) {
  let left = 0;
  let right = customers.length - 1;

  while (left <= right) {
    const mid = Math.floor((right + left) / 2);
    if (customers[mid].lastName < customer.lastName || 
      (customers[mid].lastName === customer.lastName && customers[mid].firstName < customer.firstName)) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return left;
}