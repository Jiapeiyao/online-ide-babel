# online-ide-babel
An light weight online IDE based on @babel/standalone. Import UMD libraries in html script elements and use babel to compile Typescript.

## what about module `import` and `export` in source code?
I write a babel plugin to transfer import statement into object member expression. e.g.
```typescript
import * as a from 'b/c'; // const a = b['c'];
import a from 'b/c'; // const a = b['c'];
import { c as a } from 'b'; // const a = b['c'];
```

## running in dev
```bash
npm run start
```
open localhost:8080

## build
```bash
npm run build
```

