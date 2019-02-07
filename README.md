# winston-node-sentry

This project aim to create a transport for winston 3.0.0 that send error to
sentry.

## How to use


```javascript
import Winston from 'winston'
import { SentryTransport } from 'winston-node-sentry'

let opts = {
    level: 'info',
    sentry: {
        dsn: 'YOUR-DSN'
    }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new SentryTransport(opts),
  ]
})
```

SentryTransport take an object at `sentry` entry that is the object passed to
[`Sentry.init`](https://docs.sentry.io/error-reporting/quickstart/?platform=node#configure-the-sdk)
function see the docs to change options

Some default behavor is set feel free to see [in code](srcs/index.ts#L14)

# Development

## Start

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

# License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

# Maintainer

Alexandre M <me@itsalex.fr>