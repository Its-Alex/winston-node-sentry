# winston-node-sentry

This project aim to create a transport for winston 3.0.0 that send error to
sentry.

## How to use

## Example

```javascript
import winston from 'winston'
import { SentryTransport } from 'winston-node-sentry'

let opts = {
    level: 'info',
    sentryOpts: {
        dsn: 'YOUR-DSN'
    }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new SentryTransport(opts)
  ]
})
```

Some default behavor is set feel free to see [in code](srcs/index.ts#L14)

### Options

You can pass some options to SentryTransport

```javascript
{
    debug: false,
    level: 'info',
    init: true,
    sentry: NodeSentryModule,
    sentryOpts: {},
    sentryScope: (scope) => {}
}
```

Per `options` variable above, here are the default options provided:

Transport related options:

- `name` (String) - transport's name (defaults to `winston-sentry-logger`)
- `level` (String) - transport's level of messages to log (defaults to `error`)
- `init` (Boolean) - true if transport must init sentry (defaults to `true`)
- `debug` (Boolean) - used to log each action of logger and error (defaults
  to `false`)
- `sentryScope` (Function) - default custom scope function that can be set by
  winston-node-sentry when it init `@node/sentry` (no default)

### Default Sentry Options (`options.sentryOps`)

- `logger` (String) - defaults to `winston-sentry-log`
- `server_name` (String) - defaults to `process.env.SENTRY_NAME` or
  `os.hostname()`
- `release` (String) - defaults to `process.env.SENTRY_RELEASE`
- `environment` (String) - defaults to `process.env.SENTRY_ENVIRONMENT`)
- `modules` (Object) - defaults to `package.json` dependencies
- `extra` (Object) - no default value
- `fingerprint` (Array) - no default value

For a full list of Sentry options, please visit
<https://docs.sentry.io/clients/node/config/>.

## Development

### Start

First of all you must install package

```
$ yarn install
```

You can build source to javascript

```
$ yarn build
```

or you can generate sourceMap with it

```
$ yarn build:debug
```

When you're working on this module you can watch it

```
$ yarn watch
```

## Tests

You can test if this modules works with sentry instance inside this repository

Start sentry instance

```
$ ./sentry/scripts/up.sh
```

Get sentry DSN

```
$ ./sentry/display-sentry-dsn.sh
```

Copy DSN inside [test file](/__tests__/base.ts#L12)

And execute tests

```
$ yarn test
```

## Workflow

This is written in typescript and use standard linter.

### Linter

We use `ts-lint` as linter with standard configuration, please if you submit
any pull respect lint you can check it

```
$ npm run lint
```

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)
