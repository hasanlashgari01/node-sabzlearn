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
    const users = await UserModel.find({}, "-password" ).lean()

    if (users) {
        return res.status(200).json(users)
    }

    return res.status(500).json({ message: 'Something went wrong' })
}

