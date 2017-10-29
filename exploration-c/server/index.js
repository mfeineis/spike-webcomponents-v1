const fs = require('fs');
const path = require('path');

const { promisify } = require('bluebird');
const fetch = require('isomorphic-fetch');
const express = require('express');

const app = express();
const pages = require('./pages');

const readFileAsync = promisify(fs.readFile);

const render = ({ coreScript, header, main, sidebar }) => (
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Composition Root</title>
    <script src="lib/ramda-0.24.1.js"></script>
</head>
<body>
    <header class="header">
        <div class="header__content">
            ${header}
        </div>
    </header>
    <main class="main">
        <div class="main__content">
            ${ sidebar ? `<div class="sidebar">${sidebar}</div>` : "" }
            ${ main ? `<div class="page">${main}</div>` : "" }
        </div>
    </main>
    ${coreScript ? `<script>${coreScript}</script>` : "" }
</body>
</html>`
);

app.get('/', (req, res) => {
    const coreToken = 'CORE_SECRET';
    const moduleToken = 'MODULE_SECRET';

    Promise.all([
        fetch(`http://localhost:3001/top-bar/v1/render?token=${moduleToken}`).then(response => response.text()),
        fetch(`http://localhost:3002/login-page/v1/render?token=${moduleToken}`).then(response => response.text()),
        readFileAsync(path.join(__dirname, './src/core.js'), 'utf-8'),
    ]).then(([header, main, coreScript]) => {

        res.send(render({
            coreScript: coreScript
                .replace(/%%MODULE_TOKEN%%/g, moduleToken)
                .replace(/%%CORE_TOKEN%%/g, coreToken),
            header,
            main,
        }));

    }).catch(error => res.send(`${error}`));
});

app.use('/lib',
    express.static(path.join(__dirname, './public/lib')));

//app.use(`/elements`, express.static(path.join(__dirname, `../static/elements`)));

app.listen(3000, () => console.log('Listening on port 3000...'));
