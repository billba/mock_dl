"use strict";
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.post('/:test/tokens/generate', (req, res) => {
    res.send({
        conversationId: "abc123",
        token: req.params.test,
        expires_in: 1800
    });
});
app.post('/:test/tokens/refresh', (req, res) => {
    res.send({
        conversationId: "abc123",
        token: req.params.test,
        expires_in: 1800
    });
});
app.post('/:test/conversations', (req, res) => {
    res.send({
        conversationId: "abc123",
        token: req.params.test,
        expires_in: 1800,
        streamUrl: "http://notworkingyet"
    });
    sendMessage(res, "Welcome to MockBot!");
});
let messageId = 0;
const queue = [];
const sendMessage = (res, text) => {
    queue.push({
        type: "message",
        text
    });
};
app.post('/:test/conversations/:conversationId/activities', (req, res) => {
    const id = messageId++;
    res.send({
        id: id.toString(),
    });
    sendMessage(res, `echo of post #${id}: ${req.body.text}`);
});
app.post('/:test/conversations/:conversationId/upload', (req, res) => {
    const id = messageId++;
    res.send({
        id: id.toString(),
    });
});
app.get('/:test/conversations/:conversationId/activities', (req, res) => {
    if (queue.length > 0) {
        let msg = queue.shift();
        let id = messageId++;
        msg.id = id.toString();
        msg.from = { id: "id", name: "name" };
        res.send({
            activities: [msg],
            watermark: id.toString()
        });
    }
    else {
        res.send({
            activities: [],
            watermark: messageId.toString()
        });
    }
});
app.listen(process.env.port || process.env.PORT || 3000, () => {
    console.log('listening');
});
/* Here are the supported test cases:

works: everything works perfectly

*/
