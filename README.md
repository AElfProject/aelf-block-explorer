````
# AELF Block Explorer

## Quick Start

### Install node modules Dependencies

```shell script
# install dependencies
$ yarn
````

### Dependent projects

- Firstly, start up projects listed below
  - [AElf Chain](https://github.com/AElfProject/AElf) or use a running AElf chain node
  - [aelf-block-api](https://github.com/AElfProject/aelf-block-api)
  - [aelf-web-proxy](https://github.com/AElfProject/aelf-web-proxy)

### Local Development

1. Modify the proxy config in `build/proxy.json`
   - there are several proxy configs, if you have started related projects such as `aelf-block-api` in local environment, this file doesn't need any changes
2. Change the chain node URL in script such as `yarn beforeDev -- --CHAIN_ENDPOINT https://aelf-test-node.aelf.io`
3. Run the npm script `start`
   ```shell script
   yarn dev
   ```
   this script will start a `webpack-dev-server` and listen on port `3000`, open `http:0.0.0.0:3000` in your browser manually.

### Production

For production, change the chain node URL in `config/config.js` and run:

```shell script
yarn beforeBuild -- --CHAIN_ENDPOINT https://aelf-test-node.aelf.io
yarn build
```

## api rules

- `/api/*` => `scan server`; [aelf-block-api](https://github.com/AElfProject/aelf-block-api)
- `/chain/*` => `aelf chain` [AElf Chain](https://github.com/AElfProject/AElf)
