import 'mocha'
import winston from 'winston'
import { SentryTransport } from '../srcs/index'

describe('Push error', () => {
  let logger: any

  before(() => {
    const opts: any = {
      level: 'info',
      sentryOpts: {
        dsn: ''
      }
    }

    logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new SentryTransport(opts)
      ]
    })
  })

  it('should push error', async () => {
    logger.error(new Error('ERROR'))
  })
})