const express = require('express');
const app = express();

const render = () => (
    `<div>Cat!!!!</div>`
);

app.get('/top-bar/v1/render', (req, res) => {
    res.send(render());
});

const port = 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
