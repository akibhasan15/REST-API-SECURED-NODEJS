const UsersController = require("./controllers/users.controller");
const PermissionMiddleware = require("../common/middlewares/auth.permission.middleware");
const ValidationMiddleware = require("../common/middlewares/auth.validation.middleware");
// const config = require("../common/config/env.config");
require('dotenv').config()
const VerifyUserMiddleware = require("../authorization/middlewares/verify.user.middleware");
const UserModel = require("./models/users.model");
const jwt = require("jwt-simple");
const AuthorizationController = require("../authorization/controllers/authorization.controller");
const VerifyUser = require("../common/middlewares/auth.verified.middleware");
const ADMIN = process.env.ADMIN;
const PAID = process.env.PAID_USER;
const FREE = process.env.NORMAL_USER;

exports.routesConfig = function(app) {
  app.post("/users", [UsersController.insert]);

  app.get("/confirmation/:token", [
    VerifyUser.verifyEmailToken
    //*LETS VERIFY JWT TOKEN AND MAKE isVarified=true
  ]);

  app.post("/auth", [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUser.isUserVerified,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login
  ]);
  app.get("/users", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    UsersController.list
  ]);
  app.get("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById
  ]);
  app.patch("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById
  ]);
  app.delete("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById
  ]);
};
