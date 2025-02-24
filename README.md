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
    POST https://31op0pro8f.execute-api.us-east-1.amazonaws.com/api/bulk-create
    ``

- Empty the array of customers

    ``
    DELETE <https://31op0pro8f.execute-api.us-east-1.amazonaws.com/api/clear>
    ``

- Get all customers

    ``
    GET <https://31op0pro8f.execute-api.us-east-1.amazonaws.com/api/get-all>
    ``

- Generate a random number of request to the bulk-create endpoint with random customers, returns the requests
Optional body param: currentIdNumber to specify the current id for the generated new customers

    ``
    POST <https://31op0pro8f.execute-api.us-east-1.amazonaws.com/api/simulator>
    ``

### Notes

The server is in charge of handling the array's state, not a database. This means we need to manage concurrency to prevent data from being overwritten.

We have a server function (called a lambda) that writes the array. It can only handle one request at a time, so if it gets another request while busy, it'll send back a '503' error message.

Although this is simple, there are other ways to manage concurrency that might work just as well. Regardless, the client has the job of retrying the request if it doesn't go through the first time. We added this retry feature to our simulator.
