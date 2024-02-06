import express from 'express';
import * as dotenv from 'dotenv'
import { dbConnection } from './databases/dbConnection.js';
import morgan from 'morgan';
import cors from 'cors'
import { init } from './src/modules/index.routes.js';

dotenv.config()
const app = express()
const port = 3000
app.use(cors())
dbConnection()
process.on('uncaughtException', err => console.log(err))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('uploads'))
init(app)

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
process.on('unhandledRejection', err => console.log('unhandledRejection', err))