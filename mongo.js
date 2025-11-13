const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://felipe:${password}@clusterfelipeklingerdaw.q1htk.mongodb.net/?appName=ClusterFelipeKlingerDAW`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Persons = mongoose.model("Person", PersonSchema);

if (process.argv.length == 3) {
  console.log("Phonebook:");
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length == 5) {
  const person = new Persons({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`Persona creada: `, ` ${name} / ${number}`);
    mongoose.connection.close();
  });
}
