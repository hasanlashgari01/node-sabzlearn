module.exports = async (req, res, next) => {
    const isAdmin = req.user.role === 'ADMIN'

    if (!isAdmin) {
        return res.status(403).json({ message: 'You are not allowed to access this route' })
    }

    next()
}