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

```
git clone https://github.com/KMUTT-CampusLink/campus-server.git
cd campus-server
cp .env.example .env.local
npm install
npm run dev
```

## Folder Structure :file_folder:

We have two main folders, `core` and `modules`. However, you only need to focus on `modules` folder unless you are from **_REGISTRATION_**. Inside `/modules/your-feature` folder, please create the following folders:

- controllers
- utils (for utility functions that you can use across your application)

In case you feel lost, please see the following image:<br><br>
![server_folder](https://github.com/user-attachments/assets/4e59b6b3-0be7-44a4-892e-a28be4e99bec)

## Formatting your code

> [!NOTE]
> Please refer to this [code formatting guide](https://github.com/KMUTT-CampusLink/campus-client/blob/main/README.md#formatting-your-code)

## Tech Stack

This tech stack is the bare minimum, so dependeing on features you will develop, you will need others as well.

- expressjs
- prisma
- postgres
- multer
- zod
- moment-timezone (to handle server datetime)
