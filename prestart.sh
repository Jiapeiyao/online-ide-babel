if [ ! -e dist ];then
  mkdir dist
fi

cp node_modules/react/umd/react.production.min.js dist/react.js
cp node_modules/react-dom/umd/react-dom.production.min.js dist/react-dom.js
cp node_modules/@babel/standalone/babel.min.js dist/babel.min.js
cp node_modules/antd/dist/antd.min.js dist/antd.js
cp node_modules/antd/dist/antd.min.css dist/antd.min.css

mkdir -p dist/@types/react
cp node_modules/@types/react/index.d.ts dist/@types/react/index.d.ts
cp node_modules/@types/react/global.d.ts dist/@types/react/global.d.ts

mkdir -p dist/@types/react-dom
cp node_modules/@types/react-dom/index.d.ts dist/@types/react-dom/index.d.ts

dts-bundle --name antd --main node_modules/antd/es/index.d.ts
mkdir -p dist/@types/antd
cp node_modules/antd/es/antd.d.ts dist/@types/antd/index.d.ts
