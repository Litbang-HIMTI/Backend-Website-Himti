# Table of Contents

- [Table of Contents](#table-of-contents)
- [Recommended Tools & Extensions](#recommended-tools--extensions)
- [Learning Resource](#learning-resource)
  - [Documentation](#documentation)
  - [Text/Article](#textarticle)
  - [Videos](#videos)
- [Note](#note)
  - [Typescript/Node.js](#typescriptnodejs)
  - [Mongoose & MongoDB](#mongoose--mongodb)
  - [Auth reference](#auth-reference)
  - [Security](#security)
  - [CORS](#cors)
  - [Usefull Sites](#usefull-sites)
  - [Status Codes](#status-codes)
  - [URL](#url)

# Recommended Tools & Extensions

- [VSCode](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [Postman](https://www.postman.com/downloads/)
- [Github Copilot](https://github.com/features/copilot)
- [Better Comments (VsCode Extension)](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

# Learning Resource

## Documentation

- [MongoDb](https://www.mongodb.com/docs/manual/)
- [Mongoose](https://mongoosejs.com/docs/)
- [Express](https://expressjs.com/en/api.html)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Swagger.io](https://swagger.io/docs/)

## Text/Article

- [What Is a REST API? by The Postman Team](https://blog.postman.com/rest-api-examples/)
- [REST Model & Controller with Express](https://restful-api-node-typescript.books.dalenguyen.me/en/latest/using-controller-and-model.html)
- [Model & Controller TypeScript Support Mongoose](https://mongoosejs.com/docs/typescript.html)
- [Typescript getting started](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

## Videos

**Please add video length for each video.**

- [Learn TypeScript - Full Course for Beginners by FreeCodeCamp (1h 34m)](https://youtu.be/gp5H0Vw39yw)
- [React JS Crash Course by Traversy Media (1h 48m)](https://youtu.be/w7ejDZ8SWv8)
- [Next.js in 100 Seconds // Plus Full Beginner's Tutorial by Fireship (11m)](https://youtu.be/Sklc_fQBmcs)
- [Next.js Crash Course by Traversy Media (1h 9m)](https://youtu.be/mTz0GXj8NN0)
- [RESTful APIs in 100 Seconds // Build an API from Scratch with Node.js Express by Fireship (11m)](https://youtu.be/-MTSQjw5DrM)
- [Express JS Crash Course by Traversy Media (1h 14m)](https://youtu.be/L72fhGm1tfE)
- [**Node.js** and Express.js - Full Course by FreeCodeCamp (8h 16m)](https://youtu.be/Oe421EPjeBE)

# Note

## Typescript/Node.js

- [Double Exclamation mark](https://stackoverflow.com/questions/7452720/what-does-the-double-exclamation-operator-mean)
- [Keep certain properties from objects](https://stackoverflow.com/questions/22202766/keeping-only-certain-properties-in-a-javascript-object)

## Mongoose & MongoDB

[About mongoDB limit](https://stackoverflow.com/questions/70750845/size-limit-for-mongo-db-collection-documents-and-database).
Currently, that is until V5.0 of MongoDB, 16MB is the size limit of a single bson document in MongoDB.

The number of documents per collection is unlimited but if needed a limit can be manually set. If larger documents or files need to be stored, MongoDB offers the GridFS mechanism that can support larger files. [As far as the database size goes, there is technically no limit for how big an individual database can be. If you’re using MongoDB Atlas, you won’t ever have to worry about database size as it will scale as you grow](https://www.mongodb.com/community/forums/t/maximum-size-of-database-or-collection/99576/2).

- [Validate on update](https://stackoverflow.com/questions/15627967/why-mongoose-doesnt-validate-on-update)
- [mongoose-find-vs-exec-how-to-return-values](https://stackoverflow.com/questions/50932847/mongoose-find-vs-exec-how-to-return-values)
- [Express session with mongodb](https://stackoverflow.com/questions/23260676/express-4-sessions-not-persisting-when-restarting-server)
- [Connect Mongo](https://www.npmjs.com/package/connect-mongo)

## Auth reference

- [Passport tutorial](https://github.com/AntonioErdeljac/passport-tutorial)
- [Learn how to handle authentication with Node using Passport.js](https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/)
- [a very basic session auth in node.js with express.js](https://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/)
- [restfully-design-login-or-register](https://stackoverflow.com/questions/7140074/restfully-design-login-or-register-resources)

## Security

- [Prevent Brute Force Attacks in Node.JS](https://levelup.gitconnected.com/prevent-brute-force-attacks-in-node-js-419367ae35e6)

## CORS

- [CORS with Postman](https://stackoverflow.com/questions/36250615/cors-with-postman)
- [Express Session Cookie Not Being Set when using React Axios POST Request](https://stackoverflow.com/questions/63251837/express-session-cookie-not-being-set-when-using-react-axios-post-request)
- [Using CORS in Express](https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b)
- [Why doesn't adding CORS headers to an OPTIONS route allow browsers to access my API?](https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my)

## Usefull Sites

- [Regex101](https://regex101.com/) - Validate & Test your regex here

## Status Codes

- [HttpStatusCode Enum](https://docs.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-6.0)
- [HTTP status code for update and delete?](https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete)
- [HTTP decision diagram](https://github.com/for-GET/http-decision-diagram)

## URL

- [Safe character for url](https://stackoverflow.com/questions/695438/what-are-the-safe-characters-for-making-urls)
