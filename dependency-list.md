# Dependencies while trying to Dockerize

---

## Front End Dependencies

- "@testing-library/jest-dom"
- "@testing-library/react"
- "@types/jest"
- "@types/node"
- "@types/react"
- "@types/react-dom"
- "@types/react-router-dom"
- "react"
- "react-dom"
- "react-router-dom"
- "react-scripts"
- "typescript"

- typescript can probably be a dev dependency

## Front End devDependencies

- "axios"

---

## Back End Dependencies

- "dotenv"
- "express"
- "express-session"
- "passport"
- "pg"

## Back End devDependencies

- "express-pino-logger"
- "morgan"
- "node-env-run"
- "nodemon"
- "npm-run-all"
- "pino-colada"

---

## npm Scripts

```json
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "node-env-run server --exec nodemon | pino-colada",
    "serverback": "nodemon server",
    "dev": "run-p serverback start",
    "seed": "psql -d bill-tracker -a -f ./seed.sql"
```

To run both the front and back ends simultaneously, I would use the `dev` script

`dev` uses `run-p` which comes from the `npm-run-all` dependency

- the `start` part uses the script defined by default with CRA
- `serverback` is used to start the server using `nodemon`
  - I was using the `server` script to run the server before, but that stopped working for some reason I don't quite remember

---

## Plan of Action

In dev, will split app into front end (CRA), back end (express server), and Postgres containers

- need to add re-try logic to server code (specifically, when trying to set up connection to the DB?) when attempting to connect to Postgres as containers and their processes will not start sequentially
