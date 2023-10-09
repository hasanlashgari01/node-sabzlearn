const newslettersModel = require('../../models/newsletter');
const newsletterValidator = require('../../validators/newsletter')

exports.getAll = async (req, res, next) => {
    const newsletters = await newslettersModel.find({}).lean();
    res.json(newsletters);
};

exports.create = async (req, res, next) => {
    const validationResults = newsletterValidator(req.body);

    if (validationResults !== true) {
        return res.status(422).json(validationResults);
    }

    const { email } = req.body;

    const isEmailExist = await newslettersModel.findOne({ email });

    if (isEmailExist) {
        return res.status(409).json({
            message: 'Email already exists',
        });
    }

    const category = await newslettersModel.create({ email });

    res.status(201).json({message: "You are joined to newsletters member"});
};
