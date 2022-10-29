//  @desc   logins a user into the system and return access token
//  @route  POST /api/v1/auth/login
//  @access public
//  @body   email   password
module.exports.login = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Hello, world everyone",
    },
  });
};
