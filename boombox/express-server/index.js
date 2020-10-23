const path = require("path");
const express = require("express");
const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

/*
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
*/

/*
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get("/two", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get("/helloworld", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
});

app.get("/testnav", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "testnav.html"));
});
*/

app.get("/helloworld", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "helloworld.html"));
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});



// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});