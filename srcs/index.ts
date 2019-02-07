import _ from 'lodash'
import Transport from 'winston-transport'
import * as Sentry from '@sentry/node'

interface Options {
  level?: string
  sentry: Sentry.NodeOptions
  sentryScope?(scope: Sentry.Scope): void 
}

class SentryTransport extends Transport {
  constructor(opts: Options) {
    super(opts)
    opts = _.defaultsDeep(opts, {
      level: 'error',
    })

    this.level = opts.level
    if (_.isFunction(opts.sentryScope)) Sentry.configureScope(opts.sentryScope)
    else Sentry.configureScope(this._configureScope)

    Sentry.init(opts.sentry)
  }

  log(info: any, callback: Function) {
    // Some attribute is not in type
    let self = this as any

    if (self.levels[info.level] <= self.levels[this.level!]) {
      Sentry.captureException(info.message)
    }

    callback();
  }

  _configureScope(scope: Sentry.Scope) {
    scope.setLevel(this.level as Sentry.Severity)
  }
}

export { SentryTransport }