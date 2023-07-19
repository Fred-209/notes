const mongoose = require('mongoose');

if (process.argv.length <3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fdurham:${password}@cluster0.7uvkesk.mongodb.net/testNoteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'Second test note of test database collection',
  important: false,
});

const findNote = async () => {
  const notes = await Note.find({});
  notes.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
};

// findNote();


const saveNote = async () => {
  try {
    await note.save();
    console.log('note saved');
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};

saveNote();