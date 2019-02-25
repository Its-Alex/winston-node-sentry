import { isFunction, isError, defaultsDeep } from 'lodash'
import * as Transport from 'winston-transport'
import * as Sentry from '@sentry/node'

interface WinstonSentryOptions {
  debug?: boolean
  level?: string
  init?: boolean
  sentry?: any
  sentryOpts: Sentry.NodeOptions
  sentryScope? (scope: Sentry.Scope): void
}

export class SentryTransport extends Transport.default {
  Sentry: any
  debug: boolean
  level: string

  constructor (opts: WinstonSentryOptions) {
    super(opts)
    opts = defaultsDeep(opts, {
      level: 'error',
      init: true,
      debug: false,
      sentryOpts: {
        attachStacktrace: true,
        sendDefaultPii: true,
        integrations: [
          new Sentry.Integrations.Modules(),
          new Sentry.Integrations.Transaction()
        ]
      }
    })

    this.debug = opts.debug!
    this.level = opts.level!
    if (isFunction(opts.sentryScope)) Sentry.configureScope(opts.sentryScope)

    // Define internal sentry to use
    this.Sentry = Sentry
    if (opts.sentry) this.Sentry = opts.sentry

    if (opts.init === true) this.Sentry.init(opts.sentryOpts)
  }

  log (info: any, callback: Function) {
    setImmediate(() => this.emit('logged', info))

    // Some attribute is not in Sentry type
    let self = this as any

    // No need to log if level is above transport level
    if (!(self.levels[info.level] <= self.levels[self.level!])) {
      return callback()
    }

    try {
      if (!isError(info)) {
        if (self.debug) console.log('Capture message: ', info)
        self.Sentry.captureMessage(info)
        return callback()
      }
      self.Sentry.withScope((scope: Sentry.Scope) => {
        if (self.debug) console.log('Capture exception: ', info)

        if (info.stack) scope.setExtra('stack', info.stack)
        if (info.message) scope.setExtra('message', info.message)

        self.Sentry.captureException(info)
      })
    } catch (error) {
      if (self.debug) console.log(error)
      self.emit('error', error)
    }

    callback()
  }
}
