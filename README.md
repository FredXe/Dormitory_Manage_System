# Wellcome to Dermitory Manage System
> - Final project of `Database System`
> - A Web server based on Node.js 
## NOTE
1. All the scripts run under repo's root directory (`Dormitory_Manage_System`)
2. You should always [config](#config) `.env` instead of `.env-d`.

## initialize
1. Initialize `.env`:
``` bash
( ls app/model/.env && echo '.env is already exist' ) || cat app/model/.env-d > app/model/.env
```
2. Then, configure `.env` in `app/model/`: <span id="config"/> 
``` properties
DB_HOST='<host_name>'
DB_PORT='3306'
DB_ADMIN='<admin_account>'
DB_ADMIN_PASSWORD='<password>'
DATABASE='dormitory'
```
You should change `<host_name>`, `<admin_account>` and `<password>` to your database's settings.
> NOTE: 2. You should always config `.env` instead of `.env-d`.

## usage
Install the dependencies:
``` bash
npm install
```

Put up the server:
``` bash
npm run server
```

Put up the test server:
``` bash
npm test
```
