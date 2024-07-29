const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const morgan = require('morgan');

const app = express();
const Dog = require('./models/dog')

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.set("view engine", "ejs");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/", async (req, res) => {
    res.render("index.ejs");
  });


app.get("/dogs/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/dogs", async (req, res) => {
  const dog = new Dog({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    vaccinated: req.body.vaccinated ? true: false
  });

  await dog.save();
  res.redirect('/dogs');
});

app.get('/dogs', async (req, res) => {
  const dogs = await Dog.find();
  res.render('index.ejs', { dogs });
});

app.get('/dogs/:id', async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  res.render('show.ejs', {dog});
}); 

app.get('/dogs/:id/edit', async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  res.render('edit.ejs', {dog});
});

app.put('/dogs/:id', async (req, res) => {
  const updatedDog = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    vaccinated: req.body.vaccinated ? true : false
  };

  await Dog.findByIdAndUpdate(req.params.id, updatedDog);
  res.redirect(`/dogs/${req.params.id}`);
});

app.delete('/dogs/:id', async (req, res) => {
  await Dog.findByIdAndDelete(req.params.id);
  res.redirect('/dogs');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})