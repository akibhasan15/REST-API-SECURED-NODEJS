const UserModel = require("../models/users.model");
const crypto = require("crypto");
const sendMail=require('../../common/services/sendMail');

exports.insert = async (req, res) => {
  let something = await UserModel.findByEmail(req.body.email);
  if (something==null) {

    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    
    //   console.log('req.body',req.body)
    UserModel.createUser(req.body).then(user => {

      // res.status(201).send({ id: result._id });
        //*! EMAIL VERIFICATION PROCESS-STARTS HERE

        const info={
          "email":user.email,
          "_id":user._id,
          "expiry":new Date(new Date().getTime() + 24 * 60 * 60 * 1000) 
        };
        
        console.log("info",info);

        //**!NODEMAILER STARTS HERE*/
        sendMail.UsingNodemailer(user,info)
        //**!NODEMAILER ENDS HERE*/

        res.send(
          `Hello MR./MRS. email sent to your inbox,please verify to log in`
        );
      })
      .catch(err => console.log(`err`, err));

    
  } else {
    res.status(303).send("Email Already Existed");
  }
};


exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.userId).then(result => {
    res.status(200).send(result);
  });
};
exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  UserModel.patchUser(req.params.userId, req.body).then(result => {
    res.status(204).send({});
  });
};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId).then(result => {
    res.status(204).send({});
  });
};
