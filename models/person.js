require("dotenv").config(); // cargar las variables de entorno desde el archivo .env
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB", result.connection.name);
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 9,
    validate: {
      validator : function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v); // formato 2 o 3 dígitos, guion, y 5 o más dígitos después
      }},
    required: true,
  }
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => { 
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    },
})

module.exports = mongoose.model("Person", personSchema);
