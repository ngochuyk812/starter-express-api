const express = require('express');
const userController = require('../controller/userController')
const router = express.Router();
const authMiddleware = require('../auth/auth');
const connect = require('../connect/connect')
const multer  = require('multer');
const fs = require('fs');

const isAuth = authMiddleware.isAuth;


const upload = multer({ dest: 'uploads/' });


router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/favourite',isAuth,(req,res)=>{
    connect.query('SELECT * from `favourite` where username = ?', [req.user.username], function (error, results, fields) {
        if (error) throw error;
        res.send(results)
      });
})
router.post('/favourite',isAuth,(req,res)=>{
    connect.query('INSERT INTO  `favourite` SET username = ?, idsong = ?', [req.user.username , req.body.idSong], function (error, results, fields) {
        if (error) throw error;
        res.send(req.body)
      });
})


router.post('/upload_audio', upload.single('audio'), function (req, res) {
  console.log(req.file.originalname);
  let date = new Date()
  let id = "LOCAL_"+ date.getTime()
  let title  = req.body.title || req.file.originalname 
  let artistsNames  = req.body.artists || "Không tác giả"
  connect.query('INSERT INTO  `audio` SET id = ?, title = ?, artistsNames = ?, thumbnailM = ?, path=?', [id , title,artistsNames,  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmy-best.vn%2F36853&psig=AOvVaw2QynygZqBEb6BrsWOn-yY8&ust=1685637722746000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLj8__7_n_8CFQAAAAAdAAAAABAP", req.file.path], function (error, results, fields) {
    if (error) throw error;
    res.send(id)
  });
});
module.exports = router;

