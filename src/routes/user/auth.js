const router = require('express').Router()
const User = require('../../models/User')
const { registerValidator, loginValidator } = require('./validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    const { error } = registerValidator(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send({
            user: savedUser._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/signin', async (req, res) => {
    const { error } = loginValidator(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Email is not found')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    const token = jwt.sign({
        _id: user._id
    }, process.env.SECRET_TOKEN)
    res.header('auth-token', token).send(token)
})

module.exports = router