const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const render = ({ script }) => (
    `
                <label>
                    <span>Login</span>
                    <input type="text" placeholder="User name">
                </label>
                <label>
                    <span>Password</span>
                    <input type="text" placeholder="Password">
                </label>
                <script>${script}</script>
    `
);

app.get('/login-page/v1/render', (req, res) => {
    const token = req.query.token || 'UNDEFINED_TOKEN';
    const clientJs = path.join(__dirname, './src/client.js');
    fs.readFile(clientJs, 'utf-8', (err, data) => {
        if (err) { res.send(`${err}`); return; }

        res.send(render({
            script: data.replace(/%%ACCESS_TOKEN%%/g, token),
        }));
    });
});

const port = 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
