import { TransportStreamOptions } from 'winston-transport';
import AWS from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormatterFunc = (message: any) => string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DefaultFormatter: FormatterFunc = (message: any) => JSON.stringify(message);

export interface ISqsPublisher {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(message: any): Promise<any>;
}

export type SqsTransportOptions = TransportStreamOptions & {
  /**
   * URL of the queue to deliver to.
   *
   * @type {string}
   */
  queueUrl: string;

  /**
   * If set to true, the SQS Transport logger stream will inherit the logger's
   * overall log level. Otherwise the log level will default to 'info'.
   *
   * @type {boolean}
   */
  useLoggerLevel?: boolean;

  /**
   * If set to true, the SQS Transport log format will be inherited from the
   * overall logger's format specifcation. Otherwise, the log formatter will default
   * to JSON.stringify, and appends a timestamp.
   *
   * This option overrides any value for a provided `formatter` option.
   *
   * @type {boolean}
   */
  useLoggerFormat?: boolean;

  /**
   * Specify a custom formatter function. This overrides the behavior
   * of useLoggerFormat.
   *
   * @type {FormatterFunc}
   */
  formatter?: FormatterFunc;

  /**
   * Passes through these parameters directly to the AWS SQS SDK.
   * These options are documented {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property | here}.
   *
   * @type {FirehoseClientConfig}
   */
  sqsOptions?: AWS.SQS.ClientConfiguration;

  /**
   * Optional end of line delimiter when passing messages to AWS SQS.
   * Defaults to `""`.
   *
   * @type {string}
   */
  eol?: string;

  /**
   * Injector parameter for mocking and testing.
   *
   * @private
   */
  publisher?: ISqsPublisher;
};
