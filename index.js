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
const expires_in = 1800;
const streamUrl = "http://nostreamsupport";
const get_token = (req) => (req.headers["authorization"] || "works/all").split(" ")[1];
app.post('/mock/tokens/generate', (req, res) => {
    const token = get_token(req);
    res.send({
        conversationId,
        token,
        expires_in
    });
});
app.post('/mock/tokens/refresh', (req, res) => {
    const token = get_token(req);
    res.send({
        conversationId,
        token,
        expires_in
    });
});
app.post('/mock/conversations', (req, res) => {
    const [test, area] = get_token(req).split("/");
    if (test === 'timeout' && area === 'start') {
        setTimeout(() => startConversation(req, res), timeout);
        return;
    }
    startConversation(req, res);
});
const startConversation = (req, res) => {
    const token = get_token(req);
    const [test, area] = token.split("/");
    res.send({
        conversationId,
        token,
        expires_in,
        streamUrl
    });
    sendMessage(res, `Welcome to MockBot! Here is test ${test} on area ${area}`);
};
let messageId = 0;
const queue = [];
const sendMessage = (res, text) => {
    queue.push({
        type: "message",
        text
    });
};
app.post('/mock/conversations/:conversationId/activities', (req, res) => {
    const token = get_token(req);
    const [test, area] = token.split("/");
    if (test === 'expire' && area === 'post') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (test === 'timeout' && area === 'post') {
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
app.post('/mock/conversations/:conversationId/upload', (req, res) => {
    const token = get_token(req);
    const [test, area] = token.split("/");
    if (test === 'expire' && area === 'upload') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (test === 'timeout' && area === 'upload') {
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
app.get('/mock/conversations/:conversationId/activities', (req, res) => {
    const token = get_token(req);
    const [test, area] = token.split("/");
    if (test === 'expire' && area === 'get') {
        res.status(403).send({ error: { code: "TokenExpired" } });
        return;
    }
    if (test === 'timeout' && area === 'get') {
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
