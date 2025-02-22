import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});


export type Customer = {
    firstName: string;
    lastName: string;
    age: number;
    id: number;
};

export const getCustomers = async () => {
    const command = new GetItemCommand({
        TableName: "customers",
        Key: {
            "id": { S: "1"},
        }
      });
    const response = await client.send(command);
    return JSON.parse(response?.Item?.data?.S || '[]') as unknown as Customer[];

};

export const putCustomers = async (customers: Customer[]) => {
    const command = new PutItemCommand({
        TableName: "customers",
        Item: {
            "id": { S: "1"},
            "data": { S: JSON.stringify(customers)},
        },
    });
    await client.send(command);
};
