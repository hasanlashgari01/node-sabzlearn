const ticketModel = require('../../models/ticket');
const departmentsModel = require('../../models/department');
const departmentSubModel = require('../../models/department-sub');

exports.getAll = async (req, res, next) => {
    const tickets = await ticketModel
        .find({ answer: 0 }, '-__v')
        .populate('departmentID')
        .populate('departmentSubID')
        .populate('user')
        .lean();

    res.json(tickets);
};

exports.create = async (req, res, next) => {
    const { title, body, priority, course, departmentID, departmentSubID } = req.body;
    const ticket = await ticketModel.create({
        title,
        body,
        priority,
        course,
        departmentID,
        departmentSubID,
        user: req.user._id,
        answer: 0,
        isAnswer: 0,
    });

    const mainTicket = await ticketModel
        .findOne({ _id: ticket._id })
        .populate('departmentID')
        .populate('departmentSubID')
        .populate('user')
        .lean();

    res.status(201).json(mainTicket);
};

exports.userTickets = async (req, res, next) => {
    const tickets = await ticketModel
        .find({ user: req.user._id }, '-__v')
        .sort({ _id: -1 })
        .populate('departmentID')
        .populate('departmentSubID')
        .populate('user')
        .lean();

    res.json(tickets);
};

exports.departments = async (req, res, next) => {
    const departments = await departmentsModel.find();
    res.json(departments);
};

exports.departmentsSubs = async (req, res, next) => {
    const departmentSubs = await departmentSubModel.find({ parent: req.params.id }).lean();
    res.json(departmentSubs);
};

exports.answer = async (req, res, next) => {
    const { body, ticketID } = req.body;
    const ticket = await ticketModel.findOne({ _id: ticketID }).lean();

    const answer = await ticketModel.create({
        title: 'پاسخ تیکت شما',
        body,
        parent: ticketID,
        priority: ticket.priority,
        user: req.user._id,
        isAnswer: 1,
        answer: 0,
        departmentID: ticket.departmentID,
        departmentSubID: ticket.departmentSubID,
    });

    await ticketModel.findOneAndUpdate({ _id: ticketID }, { answer: 1 });

    res.status(201).json(answer);
};

exports.getAnswer = async (req, res, next) => {
    const { id } = req.body;
    const ticket = await ticketModel.findOne({ _id: id });
    const ticketAnswer = await ticketModel.findOne({ parent: id });

    res.json({ ticket, ticketAnswer: ticketAnswer ? ticketAnswer : null });
};
