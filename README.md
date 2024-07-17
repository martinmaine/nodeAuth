Armamos el backend con NodeJs y TypeScript de tipo SQL (Relacional)

Instalaciones 
1 - npm init
2 -  npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev
3 -npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript
4-  npm install --save-dev typescript  
5 - npx tsc --init --outDir dist/ --rootDir src  (esto sirve para iniciar TypeScript, >npx node package executior> outDir nos dice a donde van a ser trnaspirado nuestros archivos de ts a js y el rootDir donde irá el proyecto en ts)

Modificamos el tsconfig.json:
  "exclude": ["node_modules", "dist"],
  "include": ["src"],


  Para levantar prisma:
  npx prisma init
  Para crear el modelo en prima:
  npx prisma generate
  Luego levantamos docker:
  docker-compose up -d
  Y migramos prisma:
  npx prisma migrate dev

  Para crear el build
  npm run build