This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. add .sentryclirc referring .sentryclirc.example
2. add .env、.env.local refferring .env.example
3. add baseConfig.js including prodRewrites and firebaseConfig, prodRewrites is just like `build/rewrites/development.js`, firebaseConfig can be found at firebase settings.

```bash
# install dependencies
$ yarn
# run the development server
yarn dev
```

### Local Development

1. Modify the proxy config in `build/rewrites/development.js`
   - there are several proxy configs
2. Run the npm script

```shell script
   yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Production

```bash
# Change the chain node URL in script such as
yarn beforeBuild -- --CHAIN_ENDPOINT https://aelf-test-node.aelf.io
yarn build
yarn start
```
