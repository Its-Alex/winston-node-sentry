import { isFunction, isError, defaultsDeep } from 'lodash'
import * as Transport from 'winston-transport'
import * as Sentry from '@sentry/node'
import * as Integrations from '@sentry/integrations'

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
          new Integrations.Transaction()
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
      let error: Error | undefined = undefined

      if (isError(info)) error = info
      else if (info.error && isError(info.error)) error = info.error

      if (typeof error === 'undefined') {
        if (self.debug) console.log('Capture message: ', info)
        self.Sentry.captureMessage(info)

        return callback()
      }

      self.Sentry.withScope((scope: Sentry.Scope) => {
        if (self.debug) console.log('Capture exception: ', error)

        scope.setExtra('info', info)

        if (error !== undefined) {
          if (error.stack) scope.setExtra('stack', error.stack)
          if (error.message) scope.setExtra('message', error.message)
        }

        self.Sentry.captureException(error)
      })
    } catch (error) {
      if (self.debug) console.log(error)
      self.emit('error', error)
    }

    callback()
  }
}
