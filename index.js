const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const id = Math.round(Math.random() * 1000)

  while (notes.some(note => note.id === id)) {
    id = Math.round(Math.random() * 1000);
  }

  return id;
}

// fetch root
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
})

// fetch all notes
app.get('/api/notes', (request, response) => {
  response.json(notes);
})

// fetch single note
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.statusMessage = 'Note not found';
    response.status(404).end();
  }
  response.json(note);
})

// delete a note
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
})

// add a note
app.post('/api/notes', (request, response) => {
  const body = request.body;
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note);

  response.json(note);
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
