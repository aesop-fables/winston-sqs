/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from 'aws-sdk';
import { ISqsPublisher } from './Types';

export class SqsPublisher implements ISqsPublisher {
  private readonly sqs: AWS.SQS;
  constructor(private readonly queueUrl: string, options?: AWS.SQS.ClientConfiguration) {
    this.sqs = new AWS.SQS(options);
  }

  async send(message: any): Promise<any> {
    const params: AWS.SQS.SendMessageRequest = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl,
    };

    await this.sqs.sendMessage(params).promise();
  }
}
