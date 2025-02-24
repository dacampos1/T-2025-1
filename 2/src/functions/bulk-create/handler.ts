import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Customer, getCustomers, putCustomers } from '../../services/dynamo';


export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const customers = await getCustomers();
    const newCustomers: Customer[] = JSON.parse(event.body || '[]');
    for (const customer of newCustomers) {
      if (!customer.firstName || !customer.lastName || !customer.age || customer.id === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Customer with ID ${customer.id} is missing required fields` }),
        };
      }

      if (customer.age <= 18) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Customer with ID ${customer.id} must be above 18 years old` }),
        };
      }
      const customerAlreadyExists = customers.find(
        (existingCustomer) => existingCustomer.id === customer.id
      );

      if (customerAlreadyExists) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `ID ${customerAlreadyExists.id} has been used before` }),
        };
      }

      const index = binarySearch(customers, customer);
      customers.splice(index, 0, customer);
    };

    await putCustomers(customers);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Customers added successfully`, customers }),
    };
  } catch (error) {
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