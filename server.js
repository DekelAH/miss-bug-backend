import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'


const app = express()

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

//* --------------- Config ---------------

const corsOptions = {

    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],

    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)



