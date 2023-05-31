const connect = require('../connect/connect')

exports.getUser = async (username, callback) => {
    connect.query('SELECT * FROM `user` WHERE `username` = ?', [username], function (error, results, fields) {
        if (error) throw error;
        callback(results);
      });

};

exports.createUser = async (user, callback) => {
	connect.query('INSERT INTO `user` set `username` = ?, hash_password = ?, email = ?', [user.username, user.pass, user.email], function (error, results, fields) {
        if (error) throw error;
        callback(results);
      });
};

exports.updateRefreshToken = async (username, refreshToken) => {
	connect.query('UPDATE  `user` set `refreshToken` = ? where username = ?', [refreshToken,username], function (error, results, fields) {
        if (error) throw error;
      });
};