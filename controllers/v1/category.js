const CategoryModel = require('../../models/category')
const categoryValidator = require('../../validators/category')
const { isValidObjectId } = require('mongoose')
const mongoose = require('mongoose')

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
    const categories = await CategoryModel.find()

    if (!categories) {
        return res.status(404).json({
            message: 'Categories not found',
        })
    }

    res.status(200).json(categories)
}

exports.delete = async (req, res) => {
    const { id } = req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)

    if (!isValidID) {
        return res.status(409).json({
            message: 'Invalid id',
        })
    }

    const category = await CategoryModel.findOneAndRemove({ _id: id })

    if (!category) {
        return res.status(404).json({
            message: 'Category not found',
        })
    }

    res.status(200).json({
        message: 'Category deleted',
    })
}

exports.update = async (req, res) => {
    const { id } = req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)

    if (!isValidID) {
        return res.status(409).json({
            message: 'Invalid id',
        })
    }

    const validationResults = categoryValidator(req.body)

    if (validationResults !== true) {
        return res.status(409).json(validationResults)
    }

    const { name, href } = req.body

    const category = await CategoryModel.findOneAndUpdate({ _id: id }, { name, href })

    if (!category) {
        return res.status(404).json({
            message: 'Category not found',
        })
    }

    res.status(200).json({
        message: 'Category updated',
    })
}