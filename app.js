const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
// routes
const authRouter = require('./routes/v1/auth');
const userRouter = require('./routes/v1/user');
const categoryRouter = require('./routes/v1/category');
const coursesRouter = require('./routes/v1/course');
const commentsRouter = require('./routes/v1/comment');
const contactsRouter = require('./routes/v1/contact');

const app = express();

app.use('/courses/covers', express.static(path.join(__dirname, 'public', 'courses', 'covers')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/v1/auth', authRouter);
app.use('/v1/users', userRouter);
app.use('/v1/category', categoryRouter);
app.use('/v1/courses', coursesRouter);
app.use('/v1/comments', commentsRouter);
app.use('/v1/contacts', contactsRouter);

module.exports = app;
