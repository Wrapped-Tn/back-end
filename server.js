const express = require('express');
const cors = require('cors');
const db = require ('./config/index.JS')
const app = express()


const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/../react-client/dist"));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });