# AELF Block Explorer

## Quick Start

Please ensure your dependencies are ready.

If you meet some permission problem, try to use 'sudo'.

```bash
bash build.sh < type|optional > < node_moduels|optinal > < nginx action | optinal>
# if you only want to use the second param, you must set the type=""
# Demos
bash build.sh dev
bash build.sh dev reinstall
bash build.sh "" reinstall
bash build.sh "" reinstall reload
bash build.sh pro reinstall reload

# bash build.sh === bash build.sh pro
```

Default Port: 3000

## Dependencise

- Start up
[AElf Chain](https://github.com/AElfProject/AElf),
[aelf-block-scan](https://github.com/AElfProject/aelf-block-scan),
[aelf-block-api](https://github.com/AElfProject/aelf-block-api)
at first

- Set the config of the nginx.

### api rules

- `/api/*` => `scan server`; [aelf-block-api](https://github.com/AElfProject/aelf-block-api)
- `/chain/*` => `aelf chain` [AElf Chain](https://github.com/AElfProject/AElf)

It means you need run aelf-block-api & AElf at first.

### RPC conf

```bash
cp config/config.example.js config/config.js
```

set your own rpc url.

### nginx.conf (advanced)

```bash
cp explore.https.conf explore.conf
```

Change 'location /chain' in Nignx to your own RPC URL.

## Develop

just run `npm start`

## Docker[TODO]

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
