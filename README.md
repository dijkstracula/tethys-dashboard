```

--.--     |    |                     |          |    |                       |
  |  ,---.|--- |---.,   .,---.   ,---|,---.,---.|---.|---.,---.,---.,---.,---|
  |  |---'|    |   ||   |`---.---|   |,---|`---.|   ||   ||   |,---||    |   |
  `  `---'`---'`   '`---|`---'   `---'`---^`---'`   '`---'`---'`---^`    `---'
                    `---'
```

## Initial setup

Initial dependencies:

* Yarn (i.e. `npm install --global yarn`)
* protoc (i.e. `brew install protobufs`)

Run `scripts/protogen.sh` to generate TypeScript definitions from the bridge
protobuf IDL file.  By default, the script assumes that your
`tethys-plc-bridge` repo is checked out in the dashboard's parent directory,
and that you're wanting tags from the Drayton Valley plant, but those paths are
overridable with the `TETHYS_BRIDGE_PATH` and `TETHYS_PROTO_NAME` environment
variables.  See the script for details.

You'll have to ensure you have ports forwarded to the plant.  Ask for the onboarding
document that describes this if you don't know how.

## Development

Run `yarn start` then navigate to `localhost:3000`.

## Deployment

Run `yarn build`.

## Useful reading:

* [Redux and Ant tutorial](https://turkogluc.com/developing-react-admin-portal-with-redux-and-ant-design/)
* [React and gRPC tutorial](https://medium.com/swlh/building-a-realtime-dashboard-with-reactjs-go-grpc-and-envoy-7be155dfabfb)
