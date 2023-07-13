import { MESSAGE } from 'triple-beam';
import Transport from 'winston-transport';
import { DefaultFormatter, FormatterFunc, ISqsPublisher, SqsTransportOptions } from './Types';
import { SqsPublisher } from './SqsPublisher';

/**
 * Winston transport that pipes log messages into AWS SQS.
 *
 * @export
 * @class SqsTransport
 * @extends {Transport}
 */
export class SqsTransport extends Transport {
  private readonly sender: ISqsPublisher;
  private formatter?: FormatterFunc;
  private name: string;
  private eol = '';

  /**
   * Creates an instance of SqsTransport.
   *
   * @param {SqsTransportOptions} options
   * @memberof SqsTransport
   */
  constructor(options: SqsTransportOptions) {
    super(options);
    this.name = 'SqsLogger';

    if (!options.useLoggerLevel) {
      this.level = options.level ?? 'info';
    }

    if (!options.useLoggerFormat) {
      this.formatter = options.formatter ?? DefaultFormatter;
    }

    if (options.eol !== undefined) {
      this.eol = options.eol;
    }

    this.sender = options.publisher ?? new SqsPublisher(options.queueUrl, options.sqsOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    // Fire and forget so we don't back up the stream.
    if (callback) {
      setImmediate(callback);
    }

    let message = info[MESSAGE];

    if (this.formatter) {
      message = Object.assign({ timestamp: new Date().toISOString() }, info);
      message = this.formatter(message);
    }

    if (this.eol.length) {
      message += this.eol;
    }

    try {
      await this.sender.send({
        ...info,
        message,
      });
      this.emit('logged', message);
    } catch (err) {
      this.emit('error', err);
    }
  }
}
