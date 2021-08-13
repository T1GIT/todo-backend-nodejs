module.exports = async (error, req, res, next) => {
    res.status(error.code).json({ error })
}
