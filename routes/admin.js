import express from 'express'
import { authenticateJWT, authorizeRoles } from '../public/authentication/jwt.js';

var router = express.Router();

router.get('/', authenticateJWT, authorizeRoles("admin"), function(req,res){
    res.render('admin.ejs')
})

router.get('/2', authenticateJWT, authorizeRoles("admin"), function(req,res){
    res.render('admin2.ejs')
})

export default router