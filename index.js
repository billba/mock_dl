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
const timeout = 60 * 1000;
const conversationId = "mockversation";
const token = "your_token_here";
const expires_in = 1800;
const streamUrl = "http://nostreamsupport";
app.post('/:test/:area/tokens/generate', (req, res) => {
    res.send({
        conversationId,
        token,
        expires_in
    });
});
app.post('/:test/:area/tokens/refresh', (req, res) => {
    res.send({
        conversationId,
        token,
        expires_in
    });
});
app.post('/:test/:area/conversations', (req, res) => {
    if (req.params.test === 'timeout' && req.params.area === 'start') {
        setTimeout(() => startConversation(req, res), timeout);
        return;
    }
    startConversation(req, res);
});
const startConversation = (req, res) => {
    res.send({
        conversationId,
        token,
        expires_in,
        streamUrl
    });
    sendMessage(res, `Welcome to MockBot! Here is test ${req.params.test} on area ${req.params.area}`);
};
let messageId = 0;
const queue = [];
const sendMessage = (res, text) => {
    queue.push({
        type: "message",
        text
    });
};
app.post('/:test/:area/conversations/:conversationId/activities', (req, res) => {
    if (req.params.test === 'expire' && req.params.area === 'post') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (req.params.test === 'timeout' && req.params.area === 'post') {
        setTimeout(() => postMessage(req, res), timeout);
        return;
    }
    postMessage(req, res);
});
const postMessage = (req, res) => {
    const id = messageId++;
    res.send({
        id,
    });
    sendMessage(res, `echo of post #${id}: ${req.body.text}`);
};
app.post('/:test/:area/conversations/:conversationId/upload', (req, res) => {
    if (req.params.test === 'expire' && req.params.area === 'upload') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (req.params.test === 'timeout' && req.params.area === 'upload') {
        setTimeout(() => upload(req, res), timeout);
        return;
    }
    upload(req, res);
});
const upload = (req, res) => {
    const id = messageId++;
    res.send({
        id,
    });
};
app.get('/:test/:area/conversations/:conversationId/activities', (req, res) => {
    if (req.params.test === 'expire' && req.params.area === 'get') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (req.params.test === 'timeout' && req.params.area === 'get') {
        setTimeout(() => getMessages(req, res), timeout);
        return;
    }
    getMessages(req, res);
});
const getMessages = (req, res) => {
    if (queue.length > 0) {
        let msg = queue.shift();
        let id = messageId++;
        msg.id = id.toString();
        msg.from = { id: "id", name: "name" };
        res.send({
            activities: [msg],
            watermark: id
        });
    }
    else {
        res.send({
            activities: [],
            watermark: messageId
        });
    }
};
app.listen(process.env.port || process.env.PORT || 3000, () => {
    console.log('listening');
});
/* Here are the supported test cases:

works/all: everything works perfectly. Enjoy.
expire/[post|get|upload]: operation fails due to expired token
timeout/[start|post|get|upload]: operation takes 60 seconds to respond

*/
