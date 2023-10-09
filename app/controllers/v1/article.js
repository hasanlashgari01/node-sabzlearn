const articleModel = require('../../models/article');
const articleValidator = require('../../validators/article');

exports.create = async (req, res, next) => {
    const validationResults = articleValidator(req.body);
    if (validationResults !== true) return res.status(422).json(validationResults);

    const { title, description, body, cover, href, categoryID, creator } = req.body;

    const article = await articleModel.create({
        title,
        description,
        body,
        cover,
        href,
        publish: 1,
        categoryID,
        creator: req.user._id,
    });

    res.status(201).json({ message: 'Article created successfully' });
};
exports.getAll = async (req, res, next) => {
    const articles = await articleModel
        .find({})
        .populate('categoryID', '-__v')
        .populate('creator', '-__v')
        .lean();
    if (!articles) return res.status(404).json({ message: 'Article not found' });

    res.json(articles);
};
exports.getOne = async (req, res, next) => {
    const { href } = req.params;
    const article = await articleModel
        .findOne({ href, publish: 1 })
        .populate('categoryID', '-__v')
        .populate('creator', '-__v');
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json(article);
};
exports.remove = async (req, res, next) => {
    const { id } = req.params;
    const article = await articleModel.findByIdAndRemove({ _id: id });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.status(201).json({ message: 'Article deleted successfully' });
};
exports.saveDraft = async (req, res, next) => {
    const validationResults = articleValidator(req.body);
    if (validationResults !== true) return res.status(422).json(validationResults);

    const { title, description, body, cover, href, categoryID, creator } = req.body;

    const article = await articleModel.create({
        title,
        description,
        body,
        cover,
        href,
        publish: 0,
        categoryID,
        creator: req.user._id,
    });

    res.status(201).json({ message: 'Article save to draft successfully' });
};
