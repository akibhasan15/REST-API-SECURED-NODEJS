require('dotenv').config({path:__dirname+'/./../../.env'})

const mongoose = require("mongoose");

let count = 0;
 
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

// const connectWithRetry = () => {
//     console.log('MongoDB connection with retry')
//     mongoose.connect("mongodb://mongo:27017/rest-tutorial", options).then(()=>{
//         console.log('MongoDB is connected')
//     }).catch(err=>{
//         console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
//         setTimeout(connectWithRetry, 5000)
//     })
// };
 
// connectWithRetry();

//*mongodb://<dbuser>:<dbpassword>@ds253418.mlab.com:53418/rest_api_
const server = process.env.SERVER;
const database = process.env.database;
const user = process.env.user;
const password = process.env.password;
// console.log("password",process.env.password)

mongoose
  .connect(`mongodb://${user}:${password}@${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  })
  .then(
    () => {
      console.log(`connection established`);
    },
    err => {
      console.log("Error occurred", err);
    }
  );

exports.mongoose = mongoose;
