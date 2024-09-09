const express = require('express')
const authController = require('../../controllers/auth-controller/auth-controller');
const authenticate = require('../../middlewares/authenticate')

const authRoute = express.Router()

authRoute.post('/register', authController.register)
authRoute.post('/login', authController.login)
authRoute.get('/me', authenticate, authController.getMe)


module.exports = authRoute