import express from "express"
import logger from "morgan"
import path from "path"
const __dirname = path.resolve();
import cookieParser from "cookie-parser";

const app = new express()

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // for req.body to work with html form
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import adminRouter from './routes/admin.js'

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT)