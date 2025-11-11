const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send(`<h1>Prueba de servidor NODE en el puerto ${PORT}!</h1>`);
});

app.get("/api/persons", (request, response) => {
  console.log(request.body);
  response.json(persons);
});

app.get("/info", (request, response) => {
  console.log(request.getMaxListeners.length);
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  // dos parametros que son el endpoint y el id
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id); // buscar en el array persons el id que coincida con el id del parametro

  if (!person) {
    // si no hay respuesta
    console.log(`No existe el id ${id}`);
    response.status(404).end(); // se envia un estado 404
  } else {
    response.json(persons.find((person) => person.id === id));
  }
});

app.delete("/api/persons/:id", (request, response) => {
  // :id es un parametro dinamico que se pasa en la url
  const id = Number(request.params.id);

  if (persons.find((p) => p.id === id)) {
    console.log(`Eliminado el id ${id}`);
    persons = persons.filter((p) => p.id !== id);
    response.sendStatus(204).end(); // response es el objeto que se envia al cliente
  } else {
    console.log(`No existe el id ${id}`);
    response.status(404).end();
  }
});

const idRamdon = () => Math.floor(Math.random() * 10000);

app.post("/api/persons", (request, response) => {
  const id = idRamdon();
  const body = request.body;

  if (!body.name || !body.number) {
    // si no hay contenido en el body
    return response.status(400).json({
      error: "El nombre y el numero son obligatorios",
    });
  } else if (persons.find((p) => p.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())) {
    return response.status(400).json({
      error: "El nombre debe ser unico",
    });
  }
  const objectPerson = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(objectPerson);
  response.json(objectPerson); // esta linea envia la respuesta al servidor diciendole que se ha creado el nuevo objeto
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
