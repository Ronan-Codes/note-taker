const express = require('express');

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
