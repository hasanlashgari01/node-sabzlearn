const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
// routes
const authRouter = require('./app/routes/v1/auth');
const userRouter = require('./app/routes/v1/user');
const categoryRouter = require('./app/routes/v1/category');
const coursesRouter = require('./app/routes/v1/course');
const commentsRouter = require('./app/routes/v1/comment');
const contactsRouter = require('./app/routes/v1/contact');
const newsletterRouter = require('./app/routes/v1/newsletter');
const searchRouter = require('./app/routes/v1/search');
const notificationRouter = require('./app/routes/v1/notification');
const offRouter = require('./app/routes/v1/off');
const orderRouter = require('./app/routes/v1/order');
const ticketRouter = require('./app/routes/v1/ticket');
const menuRouter = require('./app/routes/v1/menu');

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
app.use('/v1/newsletter', newsletterRouter);
app.use('/v1/search', searchRouter);
app.use('/v1/notification', notificationRouter);
app.use('/v1/off', offRouter);
app.use('/v1/order', orderRouter);
app.use('/v1/ticket', ticketRouter);
app.use('/v1/menu', menuRouter);

module.exports = app;
