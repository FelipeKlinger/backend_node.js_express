const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors"); // importar el paquete cors para permitir el acceso desde cualquier origen
const Person = require("./models/person"); // importar el modelo Person
app.use(express.static("dist")); // middleware para servir archivos estaticos desde la carpeta build
app.use(cors()); // middleware para permitir el acceso desde cualquier origen
app.use(express.json()); // middleware para parsear el body de las peticiones

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

app.use(
  morgan(function (tokens, req, res) {
    // este tipo de funcion se llama en JS un callback

    morgan.token("body", (req) => JSON.stringify(req.body)); // token personalizado para mostrar el body de la peticion

    return [
      tokens.method(req, res), // Método HTTP
      tokens.url(req, res), // URL solicitada
      tokens.status(req, res), // Código de estado
      tokens.res(req, res, "content-length"),
      "-", // Tamaño de la respuesta
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res), // Cuerpo de la petición
    ].join(" ");
  })
);

app.get("/", (request, response) => {
  response.send(`<h1>Prueba de servidor NODE en el puerto ${PORT}!</h1>`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons); // envia la respuesta en formato json
  });
});

app.get("/info", (request, response) => {
  console.log(request.getMaxListeners.length);
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      // si encuentra la persona
      response.json(person);
    } else {
      response.status(404).json({ error: "Person not found" }).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => nex(error)); // Si hay algun error, lo pasamos al siguiente middleware (error handler)
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // si no hay contenido en el body
    return response.status(400).json({
      error: "El nombre y el numero son obligatorios",
    });
  } else if (
    persons.find(
      (p) => p.name.toLocaleLowerCase() === body.name.toLocaleLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "El nombre debe ser unico",
    });
  }

  const objectPerson = new Person({
    name: body.name,
    number: body.number,
  });

  objectPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  
  const body = request.body; // obtener el body de la peticion
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // middleware para manejar endpoints desconocidos

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler); // middleware para manejar errores

const PORT = process.env.PORT || 3001; // process.env.PORT significa que si hay una variable de entorno PORT la use, si no use el puerto 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
