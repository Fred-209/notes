const notesRouter = require('express').Router();
const Note = require('../models/note');

// fetch all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

// fetch single note
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);

    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// add a note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

// delete a note
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch(error) {
    next(error);
  }
});


// modify a note
notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body;
  const note = { content, important };

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      note,
      { new: true }
    );

    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;