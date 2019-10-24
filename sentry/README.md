# Local Sentry in Spacefill Development Kit

```
$ ./scripts/up.sh
```

You can now go on the interface create a new project at [http://localhost:8028](http://localhost:8028)

Default login are:

* username: `admin@example.com`
* password: `password`

Sometime, you need to extract project DSN to use it in script:

```
$ ./display-sentry-dsn.sh
http://e2cdc520f1904e10bdc076d1a971bb84:92000959382e482e817b43fc3be589e7@0.0.0.0:8028/1
```

Execute this line to stop and clean Sentry installation:

```
$ /scripts/down.sh
```