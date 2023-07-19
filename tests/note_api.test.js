const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
  // let noteObject = new Note(initialNotes[0]);
  // await noteObject.save();
  // noteObject = new Note(initialNotes[1]);
  // await noteObject.save();
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');

  expect(response.body).toHaveLength(initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map(note => note.content);
  expect(contents).toContain(initialNotes[1].content);
});

afterAll(async () => {
  await mongoose.connection.close();
});