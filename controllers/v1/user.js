const mongoose = require('mongoose')
const UserModel = require('../../models/user')
const banUserModel = require('../../models/ban-phone')

exports.banUser = async (req, res) => {
    const mainUser = await UserModel.findOne({ _id: req.params.id }).lean()
    const banUserResult = await banUserModel.create({ phone: mainUser.phone })

    if (banUserResult) {
        return res.status(200).json({
            message: 'User has been banned',
        })
    }

    return res.status(500).json({ message: 'Something went wrong' })
}

exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find({}, '-password').lean()

    if (users) {
        return res.status(200).json(users)
    }

    return res.status(500).json({ message: 'Something went wrong' })
}

exports.removeUser = async (req, res) => {
    const isValidUserID = mongoose.Types.ObjectId.isValid(req.params.id)

    if (!isValidUserID) {
        return res.status(409).json({ message: 'Invalid user ID' })
    }

    const removedUser = await UserModel.findOneAndRemove({ _id: req.params.id }).lean();

    if (!removedUser) {
        return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ message: 'User has been removed' })
}

