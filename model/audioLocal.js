
const connect = require('../connect/connect')

exports.getAudio = (callback)=>{
    connect.query('SELECT * FROM `audio`  ',  function (error, results, fields) {
        if (error) throw error;
      
        callback(results);
      });
}


// 'Nguyễn Ngọc Huy'.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
