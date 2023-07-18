require('dotenv').config();
const express = require('express');
const app = express();
const Note = require('./models/note');
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());


const fetchNotes = async (request, response) => {
  const allNotes = await Note.find({});
  response.json(allNotes);
};

// fetch root
app.get('/',  (request, response) => {
  response.send('<h1>Hello World</h1>');
});

// fetch all notes
app.get('/api/notes', async (request, response) => {
  await fetchNotes(request, response);
});

// fetch single note
app.get('/api/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);

    if (note) {
      response.json(note);
    } else {
      response.statusMessage = 'Note not found';
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// delete a note
app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch(error) {
    next(error);
  }
});

// add a note
app.post('/api/notes', async (request, response, next) => {
  try {
    const body = request.body;

    if (!body.content) {
      return response.status(400).json({
        error: 'content missing'
      });
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
    });

    const savedNote = await note.save();
    response.json(savedNote);

  } catch (error) {
    next(error);
  }
});


// modify a note
app.put('/api/notes/:id', async (request, response, next) => {
  try {
    const { content, important } = request.body;

    const note = { content, important };

    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      note,
      { new: true, runValidators: true, context: 'query' }
    );

    response.json(updatedNote);
  } catch (error) {
    next(error);
  }

});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
1;
// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send( { error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error.message });
  }

  next(error);
};

app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
