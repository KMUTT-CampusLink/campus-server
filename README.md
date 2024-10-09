# Server Side (Developer Guide) :open_book:

> [!IMPORTANT]
> Please open your terminal and run the following command to check the `node.js` version. If less than `v20.0.0`, please update using `node version manager` or any methods.
>
> ```
> node -v
> ```
>
> For your reference, [update node.js](https://nodejs.org/en/download/package-manager)

## Project Initialization

Open the root project folder in your favorite terminal and run the following commands:

```shell
> git clone https://github.com/KMUTT-CampusLink/campus-server.git
> cd campus-server
> cp .env.example .env
> npm install
> npx prisma generate
> npm run dev
```

> [!IMPORTANT]
> To use the `prisma client`, you don't need to create a new prisma object as creating many objects has some damage. Just put the following line in your files.

```js
import prisma from "./db/prismaInstance.js";
```

> [!TIP]
> If you run into `The table (not available) does not exist in the current database` error while doing `CRUD`, you might want to run this migration command:

```shell
> npx prisma migrate dev --name init
```

## Seeding Database :memo:

> [!NOTE]
> If you want to populate your tables with seed, which is random data to test your logic, please do the following. [Learn More](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)

Create a new folder called' seed' inside `/core/prisma/` folder. In that folder you have just created, create a new file named `index.js` where your seeding logic will be implemented. After your logic is set, run the following command:

```shell
> npx prisma db seed
```

## Folder Structure :file_folder:

We have two main folders, `core` and `modules`. Please do the following steps to create an organized folder:

1. Under `/modules/your-feature` folder, please create the following folders:
   - controllers
   - middleware (middleware for role-based access control)
   - utils (for utility functions that you use across your application)

In case you feel lost, please see the following image:<br><br>
![server_folder](https://github.com/user-attachments/assets/21a11702-33ac-494a-98f7-d8181ccf8b91)

## Git branching & Pull request

> [!TIP]
> Please refer to this [git guide](https://github.com/KMUTT-CampusLink/campus-client?tab=readme-ov-file#bit-branching--pull-request)

## Formatting your code

> [!NOTE]
> Please refer to this [code formatting guide](https://github.com/KMUTT-CampusLink/campus-client/blob/main/README.md#formatting-your-code)

## Tech Stack

This tech stack is the bare minimum, so depending on features you will develop, you will need others as well.

- expressjs
- prisma
- postgres
- multer
- zod
- moment-timezone (to handle server datetime)
