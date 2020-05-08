# online-ide-experiment

An Online IDE for a frontend UI library.
Using ant-design as the library.

## running in dev
terminal1:
```bash
npm run dev:service
```
terminal2:
```bash
npm run dev:website
```
ternimal3
```bash
npm run dev:start
```

## build + start
```bash
npm run build
npm start
```

## open
open http://localhost:8080 in chrome.

## how to be better (some thoughts)
1. nginx balance load with multiply nodejs servers
2. better webpack config to speed up packing
3. one project with webpack-dev-server per docker container