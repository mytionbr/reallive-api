import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.ENDPOINT,
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export default docClient;
