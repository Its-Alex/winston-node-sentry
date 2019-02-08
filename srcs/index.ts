import _ from 'lodash'
import Transport from 'winston-transport'
import * as Sentry from '@sentry/node'

interface WinstonSentryOptions {
  level?: string
  init?: boolean
  sentry?: any
  sentryOpts: Sentry.NodeOptions
  sentryScope? (scope: Sentry.Scope): void
}

export class SentryTransport extends Transport {
  Sentry: any

  constructor (opts: WinstonSentryOptions) {
    super(opts)
    opts = _.defaultsDeep(opts, {
      level: 'error',
      init: true,
      sentryOpts: {
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

    // Define internal sentry to use
    this.Sentry = Sentry
    if (opts.sentry) this.Sentry = opts.sentry

    if (opts.init === true) this.Sentry.init(opts.sentryOpts)
  }

  log (info: any, callback: Function) {
    setImmediate(() => this.emit('logged', info))
    // Some attribute is not in type
    let self = this as any

    if (self.levels[info.level] <= self.levels[this.level!]) {
      if (_.isError(info)) {
        this.Sentry.withScope((scope: Sentry.Scope) => {
          scope.setExtra('stack', info.stack)
          scope.setExtra('message', info.message)

          this.Sentry.captureException(info)
        })
      } else {
        this.Sentry.captureMessage(info)
      }
    }

    callback()
  }
}
