const { isValidObjectId } = require('mongoose');
const nodemailer = require('nodemailer');
const contactModel = require('../../models/contact');

exports.getAll = async (req, res, next) => {
    const contacts = await contactModel.find({}).lean();

    return res.json(contacts);
};

exports.create = async (req, res, next) => {
    const { name, email, phone, body } = req.body;

    const contact = await contactModel.create({ name, email, phone, body, answer: 0 });

    return res.status(201).json(contact);
};

exports.remove = async (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.json({ message: 'Contact Id not valid' });

    const deletedContact = await contactModel.deleteOne({ _id: id });

    if (deletedContact.deletedCount == 0)
        return res.status(404).json({ message: 'Contact not found' });

    return res.json({ message: 'Comment removed successfully' });
};

exports.answer = async (req, res, next) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hasanlashgari01@gmail.com',
            pass: 'dscw oovw vplj sxlr',
        },
    });

    const mailOptions = {
        from: 'hasanlashgari01@gmail.com',
        to: req.body.email,
        subject: 'آکادمی سبزلرن',
        text: req.body.answer,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            return res.json({ message: error });
        } else {
            const contact = await contactModel.findOneAndUpdate(
                { email: req.body.email },
                { answer: 1 }
            );
            return res.json({ message: 'Email sent successfully :))' });
        }
    });
};
