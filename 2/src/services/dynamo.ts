import DynamoDB from "aws-sdk/clients/dynamodb";

const docClient = new DynamoDB.DocumentClient();

const key = {
    'id': '1',
};

export type Customer = {
  firstName: string;
  lastName: string;
  age: number;
  id: number;
};


export const getCustomers = async () => {
    const params = {
        TableName: 'customers',
        Key: key
    };
    const response = await docClient.get(params).promise();
    return response.Item?.data as Customer[] || [];
}

export const putCustomers = async (customers: Customer[]) => {
    const params = {
        TableName: 'customers',
        Item: {
            'id': '1',
            'data': customers
        }
    };
    await docClient.put(params).promise();
}