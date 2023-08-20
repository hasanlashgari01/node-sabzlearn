const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../../models/user')
const banUserModel = require('../../models/ban-phone')

const registerValidator = require('../../validators/register')
const { banUser } = require('./user')

exports.register = async (req, res, next) => {
    const validationResults = registerValidator(req.body)

    if (validationResults !== true) {
        return res.status(422).json(validationResults)
    }

    const { username, name, email, password, phone } = req.body

    const isUserExist = await userModel.findOne({ $or: [{ username }, { email }] })

    if (isUserExist) {
        return res.status(409).json({
            message: 'User already exists',
        })
    }

    const isUserBan = await banUserModel.find({ phone })

    if (isUserBan.length) {
        return res.status(409).json({
            message: 'User is banned',
        })
    }

    const countOfUsers = await userModel.count()

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await userModel.create({
        username,
        name,
        email,
        password: hashedPassword,
        phone,
        role: countOfUsers === 0 ? 'ADMIN' : 'USER',
    })

    const userObject = user.toObject()
    Reflect.deleteProperty(userObject, 'password')

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30 days' })

    return res.status(201).json({ user: userObject, accessToken })
}

exports.login = async (req, res, next) => {
}

exports.getMe = async (req, res, next) => {
}