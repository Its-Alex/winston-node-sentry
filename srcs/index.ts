import _ from 'lodash'
import Transport from 'winston-transport'
import * as Sentry from '@sentry/node'

interface WinstonSentryOptions {
  level?: string
  sentry: Sentry.NodeOptions
  sentryScope? (scope: Sentry.Scope): void
}

class SentryTransport extends Transport {
  constructor (opts: WinstonSentryOptions) {
    super(opts)
    opts = _.defaultsDeep(opts, {
      level: 'error',
      sentry: {
        attachStacktrace: true,
        sendDefaultPii: true,
        integrations: [
          new Sentry.Integrations.Modules(),
          new Sentry.Integrations.Transaction()
        ]
      }
    })

    this.level = opts.level
    if (_.isFunction(opts.sentryScope)) Sentry.configureScope(opts.sentryScope)

    Sentry.init(opts.sentry)
  }

  log (info: any, callback: Function) {
    setImmediate(() => this.emit('logged', info))
    // Some attribute is not in type
    let self = this as any

    if (self.levels[info.level] <= self.levels[this.level!]) {
      if (_.isError(info)) {
        Sentry.withScope(scope => {
          scope.setExtra('stack', info.stack)
          scope.setExtra('message', info.message)

          Sentry.captureException(info)
        })
      } else {
        Sentry.captureMessage(info)
      }
    }

    callback()
  }
}

export { SentryTransport }
