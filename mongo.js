//mongo.js vaiheessa 3.12
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password (and name and number) as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://torniainenkonsta:${password}@cluster0.nzvlabo.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  Name: String,
  Number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    id: Math.floor(Math.random() * 10000),
    Name: name,
    Number: number,
  })

  person.save().then((result) => {
    console.log(`Person: ${name} Number: ${number} added to phonebook`)
    mongoose.connection.close()
  })
} else {
  // Tulosta tietokannassa olevat numerotiedot
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`${person.Name} ${person.Number}`)
    })
    mongoose.connection.close()
  })
}