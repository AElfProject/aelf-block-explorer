# browser

AELF Block Explorer

2 api rules:

1. `/api/!${rpc}/*` => `scan server`; [aelf-block-api](https://github.com/AElfProject/aelf-block-api)
2. `/chain/*` => `aelf chain` [AElf Chain](https://github.com/AElfProject/AElf)

Default Port: 3000

## Develop

just run `npm start`

## build

deploy exec `sh ./build.sh`

docker build exec `sh ./build-image.sh`

## Project Struct

```text
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── build-image.sh
├── build.sh
├── dockerfile
├── explore.conf
├── nwb.config.js
├── package-lock.json
├── package.json
├── public
├── src
│   ├── App.js
│   ├── App.less
│   ├── Store.js
│   ├── assets
│   ├── components
│   ├── constants.js
│   ├── index.html
│   ├── index.js
│   ├── index.less
│   ├── pages
│   ├── routes.js
│   └── utils.js
└── tests
    └── App-test.js
```

## Dependence libs

1. [https://github.com/mobxjs/mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) it's a state manage lib, using the store to support realtime fetching data.
2. [https://github.com/insin/nwb](https://github.com/insin/nwb) it's a toolkit for React build. it's configuration of the nwb.config.js.
3. [https://github.com/infinitered/apisauce](https://github.com/infinitered/apisauce) it support Axios + standardized errors + request/response transforms.
