const CategoryModel = require('../../models/category')
const categoryValidator = require('../../validators/category')

exports.create = async (req, res) => {
    const validationResults = categoryValidator(req.body)

    if (validationResults !== true) {
        return res.status(422).json(validationResults)
    }

    const { name, href } = req.body

    const isCategoryExist = await CategoryModel.findOne({ href })

    if (isCategoryExist) {
        return res.status(409).json({
            message: 'Category already exists',
        })
    }

    const category = await CategoryModel.create({ name, href })

    res.status(201).json(category)
}

exports.getAll = async (req, res) => {
}

exports.delete = async (req, res) => {
}

exports.update = async (req, res) => {
}