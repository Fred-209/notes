const jwt = require('jsonwebtoken');
const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && /^bearer /i.test(authorization)) {
    return authorization.slice(7);
  }
  return null;
};

// fetch all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  response.json(notes);
});

// fetch single note
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// add a note
notesRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json( { error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.json(savedNote);
});

// delete a note
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});


// modify a note
notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body;
  const note = { content, important };

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    note,
    { new: true }
  );

  response.json(updatedNote);
});

module.exports = notesRouter;