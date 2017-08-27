const path = require('path');

const express = require('express');
const app = express();

const { render } = require('./pack/render');
const pages = require('./pages');

app.get('/', (req, res) => {
    res.send(render(pages.home));
});

app.use('/lib',
    express.static(path.join(__dirname, '../static/lib')));

app.use(`/elements`, express.static(path.join(__dirname, `../static/elements`)));

app.listen(3000, () => console.log('Listening on port 3000...'));
