# Coding Test

## 1

### Setup

``
npm install -g typescript
``

### Run

``
tsc 1/index.ts; node 1/index.js;
``

## 2

### Deployment

``
serverless deploy -s prod
``

### API

- Create customers from giving array of customers

    ``
    POST https://r7abtoek3c.execute-api.us-east-1.amazonaws.com/api/bulk-create
    ``

- Empty the array of customers

    ``
    DELETE <https://r7abtoek3c.execute-api.us-east-1.amazonaws.com/api/clear>
    ``

- Get all customers

    ``
    GET <https://r7abtoek3c.execute-api.us-east-1.amazonaws.com/api/get-all>
    ``

- Generate a random number of request to the bulk-create endpoint with random customers, returns the requests
Optional body param: currentIdNumber to specify the current id for the generated new customers

    ``
    POST <https://r7abtoek3c.execute-api.us-east-1.amazonaws.com/api/simulator>
    ``

### Notes

The server is responsible for maintaining the state of the array, as opposed to a database. This necessitates appropriate concurrency management to ensure that data isn't inadvertently overwritten.

The endpoint produces events for an SQS queue, enabling the Lambda function to process each request asynchronously while simultaneously supporting parallel requests. Then the array is persisted in Dynamo to avoid losing data.

This may cause a small delay in the update of the array.
