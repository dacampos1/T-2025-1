import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

type Customer = {
  firstName: string;
  lastName: string;
  age: number;
  id: number;
};

export let customers: Customer[] = [];

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const newCustomers: Customer[] = JSON.parse(event.body || '[]');
    newCustomers.forEach((customer) => {
      if (!customer.firstName || !customer.lastName || !customer.age || customer.id === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `All fields must be supplied` }),
        };
      }

      if (customer.age <= 18) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Customer must be above 18 years old` }),
        };
      }

      if (customers.find((existingCustomer) => existingCustomer.id === customer.id)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `ID has been used before` }),
        };
      }

      let index = 0;
      while (
        index < customers.length &&
        (customers[index].lastName < customer.lastName ||
          (customers[index].lastName === customer.lastName && customers[index].firstName < customer.firstName))
      ) {
        index++;
      }
      customers.splice(index, 0, customer);
    });
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
