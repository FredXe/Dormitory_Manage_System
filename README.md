# Dermitory Manage System
> A Web server based on Node.js

## usage
Initialize `.env`:
``` console
( ls app/model/.env && echo '.env is already exist' ) || cat app/model/.env-d > app/model/.env;
```
Then, configure `.env`:
``` properties
DB_HOST='<host_name>'
DB_PORT='3306'
DB_ADMIN='<admin_account>'
DB_ADMIN_PASSWORD='<password>'
DATABASE='dormitory'
```
You should change `<host_name>`, `<admin_account>` and `<password>` to your database's settings.
NOTE: You should always config `.env` instead of `.env-d`.

Install the dependencies:
``` console
npm install
```

Put up the server:
``` console
npm run server
```

Put up test server:
``` console
npm test
```