const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        unique:true
    },
    password: String,
    permissionLevel: Number,
    isVerified:{
        default:false,
        type:String
    }
});

// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});


userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const User = mongoose.model('Users', userSchema);


exports.findByEmail =  (email) => {
    return  User.findOne({email: email})
};

exports.findById = (id) => {
    return User.findById(id,{email:1,password:1,_id:0})
        .then((result) => {
            result = result.toJSON();
            // delete result._id;
            delete result.id; 
            // delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {

        const user = new User(userData);
        return user.save();
    

};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find({},{email:1,_id:0})
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })

};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

