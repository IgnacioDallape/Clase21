import express from 'express'
const app = express()

import {router as authRouter} from './router/auth.js'
import { initializatePassport } from './config/passport.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'

app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())
initializatePassport()
app.use('/auth', authRouter)

app.listen(8080,  () =>{
    console.log('corriendo en el servidor 8080')
})