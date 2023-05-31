const userModel = require('../model/user')
const authMethod = require('../model/generateToken')

exports.isAuth = async (req, res, next) => {
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.send('Bạn không có quyền truy cập vào tính năng này!');
	}

	const user = await userModel.getUser(verified.payload.username, (rs)=>{
        req.user = rs[0];
        return next();
    });

};