const mongooes = require("mongoose");

const ConnectdDb = async () => {
  try {
    mongooes.connect(process.env.MONGO_URI);
    console.log("Connected Mongo Sucessfully");
  } catch (error) {
    console.log("error to connect mongose", error);
  }
};

module.exports = ConnectdDb;