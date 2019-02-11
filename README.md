# winston-node-sentry

This project aim to create a transport for winston 3.0.0 that send error to
sentry.

## How to use

## Example

```javascript
import Winston from 'winston'
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

#### debug

Used to log each action of logger and error

#### level

Equivalent to winston level sentry will log error if level is same or below

#### init

This options is to set if winston-node-sentry must init `@node/sentry` module,
or if user want to do it.

#### sentry

Is an `@node/sentry` object that can be used internally, if not passed
winston-node-sentry will create his own

#### sentryOpts

Options passed to `@node/sentry` see [docs](https://docs.sentry.io/error-reporting/quickstart/?platform=node#configure-the-sdk) to get some more infos

#### sentryScope

Default custom scope function that can be set by winston-node-sentry when it
init `@node/sentry`

## Development

### Start

First of all you must install package

```
$ npm install
```

You can build source to javascript

```
$ npm run build
```

or you can generate sourceMap with it

```
$ npm run build:debug
```

When you're working on this module you can watch it

```
$ npm run watch
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
