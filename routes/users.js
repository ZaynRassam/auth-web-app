import { queryAllUsers, insertUser, updateUserPassword, deleteUser} from '../public/postgres/postgres.js'
import bcrpyt from "bcryptjs"
import express from 'express'
import jwt from 'jsonwebtoken'
var router = express.Router();
var allUsers;

const hashed_adminpassword = await bcrpyt.hash(process.env.ADMINPASSWORD, 10)

router.get('/login', function(req, res){
    res.render("login.ejs", {userCreated: false, wrongCredentials: false})
})

router.post('/login', async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password

    allUsers = await queryAllUsers()
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    const user = { name: dbUser.username, role: dbUser.role}
    if (dbUser == null) {
        return res.status(400).render("login.ejs", {userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
    }
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN)
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })
            res.redirect('/admin')
        } else {
            return res.status(400).render("login.ejs", {userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get("/signup", function(req, res){
    res.render("signup.ejs", {})
})

router.post('/signup', async function(req,res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password
    const hashedPassword = await bcrpyt.hash(reqPassword, 10)

    allUsers = await queryAllUsers()

    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        try {
            insertUser(reqUsername, hashedPassword, 'user')
            res.status(201).render("login.ejs", {userCreated: true, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: false})
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(500).render("signup.ejs", {usernameTaken: true})
    }
})

router.get("/update-password", function(req, res){
    res.render("updateAccountPassword.ejs", {})
})

router.post('/update-password', async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password
    const reqNewPassword = req.body.newPassword

    allUsers = await queryAllUsers()
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        res.status(400).render("update-password.ejs", {invalidUsername: true})
    }
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            const hashedPassword = await bcrpyt.hash(reqNewPassword, 10)
            updateUserPassword(reqUsername, hashedPassword)
            res.status(201).render("login.ejs", {changedPassword: true, userCreated: false, wrongCredentials: false})
        } else {
            return res.status(400).render("login.ejs", {userCreated: true, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/delete-user', function(req,res){
    res.render('deleteUser.ejs')
})

router.post('/delete-user', async function(req, res){
    const reqUsername = req.body.username.toLowerCase()
    const reqPassword = req.body.password

    allUsers = await queryAllUsers()
    const dbUser = allUsers.find(dbUser => dbUser.username === reqUsername)
    if (dbUser == null) {
        return res.status(400).render("deleteUser.ejs", {wrongCredentials: true})
    }
    try {   
        if (await bcrpyt.compare(reqPassword, dbUser.hashed_password) || await bcrpyt.compare(reqPassword, hashed_adminpassword)){
            deleteUser(reqUsername)
            res.status(201).render("login.ejs", {userDeleted: true, changedPassword: false, userCreated: false, wrongCredentials: false})
        } else {
            return res.status(400).render("deleteUser.ejs", {userDeleted: false, userCreated: false, attemptedUsername: reqUsername, attemptedPassword: reqPassword, wrongCredentials: true})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

export default router
