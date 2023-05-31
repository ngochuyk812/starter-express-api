const userModel = require('../model/user')
const authMethod = require('../model/generateToken')
const randToken = require('rand-token')
const bcrypt = require('bcrypt')
require('dotenv').config();

exports.login = async (req,res)=>{
    let username  = req.body.username
    let password  = req.body.password
	const user = await userModel.getUser(username, async(rs)=>{
		console.log(rs[0], password);

		if (rs.length === 0) {
			return res.status(401).send('Tên đăng nhập không tồn tại.');
		}
		const isPasswordValid = bcrypt.compareSync(password, rs[0].hash_password);
		if (!isPasswordValid) {
			return res.status(401).send('Mật khẩu không chính xác.');
		}
		const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
		console.log(accessTokenLife,accessTokenSecret);
		const dataForAccessToken = {
			username: rs[0].username,
		};
		const accessToken = await authMethod.generateToken(
			dataForAccessToken,
			accessTokenSecret,
			accessTokenLife,
		);
		if (!accessToken) {
			return res
				.status(401)
				.send('Đăng nhập không thành công, vui lòng thử lại.');
		}

		let refreshToken = randToken.generate(30); 
		if (!rs.refreshToken) {
			await userModel.updateRefreshToken(rs[0].username, refreshToken);
		} else {
			refreshToken = user.refreshToken;
		}

		return res.json({
			msg: 'Đăng nhập thành công.',
			accessToken,
			refreshToken,
			user,
		});
	});
	

	

	
}



exports.register =  async (req, res) => {
	const username = req.body.username.toLowerCase();
	const email = req.body.email;
	await userModel.getUser(username, async(rs)=>{
		if (rs.length > 0) res.status(409).send('Tên tài khoản đã tồn tại.');
		else {
			const hashPassword = bcrypt.hashSync(req.body.password, 5);
			const newUser = {
				username: username,
				pass: hashPassword,
				email
			};
			await userModel.createUser(newUser,(rs2)=>{
				console.log(rs2);
				if (!rs2) {
					return res
						.status(400)
						.send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
				}
				return res.send({
					username,
				});
			});
			
			
		}
	});
	
};