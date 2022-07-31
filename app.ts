'use strict'
const express = require('express');

const app = express();
const session = require("express-session")
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const DB_URL = `mongodb+srv://Iryna:2022scorpions@cluster0.scjo1.mongodb.net/?retryWrites=true&w=majority`
const host = '127.0.0.1'
const port = 3005
const fs = require("fs");
let number = 0
const cors = require('cors');
const path = require('path')
app.use(cors());
app.use(express.static('public'))
const Point = new Schema({
    id: { type: String },
    items: [{
        id: { type: String },
        text: { type: String },
        checked: { type: Boolean }
    }]
})
const FileStore = require('session-file-store')(session);
app.use(express.json())
app.use(express.static('public'));
app.use(
    session({
        store: new FileStore({ retries: 0 }),
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: undefined,
            secure: false,
            sameSite: true,
        },
    })
);
//app.use(bodyParser.urlencoded({extended : true})); app.use(bodyParser.json());

app.get("/api/v1/items", async function (req: any, res: any) {
    try {
        const todo = mongoose.model("todo", Point)
        const post = await todo.find()
        return res.send(JSON.stringify(post));
    } catch (e) {
        res.status(500).json(e)
    }

});

app.post("/api/v1/items", async function (req: any, res: any) {
    try {
        let { id, items } = req.body
        const todo = mongoose.model("todo", Point)
        number = JSON.parse(fs.readFileSync("id.json"))
        const post = await todo.create({ id: `${number}`, items })

        res.status(200).json(number)
        number++
        fs.writeFileSync("id.json", JSON.stringify(number));
    } catch (e) {
        res.status(500).json(e)
    }
})
app.put('/api/v1/items', async function (req, res) {
    try {
        let y = req.body._id
        const todo = mongoose.model("todo", Point)
        const result = await todo.findByIdAndUpdate(req.body.id, { items: `${req.body.items}` })
        res.status(200).json(result)

    } catch (e) {
        res.status(500).json(e)
    }
})
app.delete('/api/v1/items', async function (req, res) {
    try {
        let y = req.body.id
        const todo = mongoose.model("todo", Point)
        await todo.findOneAndDelete({ id: `${y}` })
        res.status(200).json({ "ok": true })
    } catch (e) {
        res.status(500).json(e)
    }
})
async function startApp() {
    try {
        await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
        app.listen(port, host, function () {
            return console.log("Server listens http://");
        });
    }
    catch (e) {
    }
}
startApp()