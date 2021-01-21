const express = require('express');

const PORT = process.env.PORT || 3001;

const fs = require('fs');
const path = require('path');

// instantiate the server
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

/* activate after setting up routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
*/

// allows front-end resources like images, client-side JS, or CSS available when called in index.html
app.use(express.static('public'));

// consts and functions for apiRoutes start
const { notes } = require('./db/db.json');
const { v4: uuidv4 } = require('uuid')

// get for db.json and return
app.get('/api/notes', (req, res) => {
    return res.json(notes);
});

// note function
function createNewNote(body, notesArray) {
    const note = body;
    // then push the new note to db.json array
    notesArray.push(note);
    // write to db.json
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

app.post('/api/notes', (req, res) => {
    // generate unique id
    const uniqueId = uuidv4();
    // assign the unique id to note (req.body)
    req.body.id = uniqueId;
    // create note and return it
    const note = createNewNote(req.body, notes);
    return res.json(note)
})

function deleteNote(searchedId, notesArray) {
    // if searched id is in json, continue
    if (notesArray.some(note => note.id === searchedId)) {
        // Acquire the index of searchedId
        const noteIndex = notesArray.findIndex(note => note.id === searchedId);
        notesArray.splice(noteIndex, 1);
        // Finally, write the db.json with deleted note
        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify({ notes: notesArray }, null, 2)
        );
        return true;
    } else {
        return false;
    }
}

// delete from notes array
app.delete('/api/notes/:id', (req,res) => {
    // const for searchedId
    const searchedId = req.params.id;
    // get index element with searchedId
    const response = deleteNote(searchedId, notes);

    // see if searchedId element is in notes then delete else send error
    if (response) {
        return res.status(200).send(`Note with ID: ${searchedId} deleted from database`)
    } else {
        return res.status(400).send("Enter a valid note id to delete");
    }
});
//consts for apiRoutes end


// api routes start


// html routes start
// route to root index.html
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, './public/index.html'));
});

// route to notes.html
app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, './public/notes.html'));
});
//html routes end



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
