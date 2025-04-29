import express from 'express'
import { authenticateJWT, loggedInAs } from '../public/authentication/jwt.js';

var router = express.Router();

router.get('/', function(req,res){
    res.render('index.ejs', {user: req.user})
})

export default router