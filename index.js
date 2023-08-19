const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))
require('dotenv').config()
const Person = require('./models/person')

//cors käyttöön tällä konfiguraatiolla "toistaiseksi (kohta 3b alku)"
const cors = require('cors')
app.use(cors())

//tehty 3.1-3.7, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15,  3.18
//ei tehty: 3.8, 3.16, 3.17

//palauttaa listan henkilöistä
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

//infosivu, joka palauttaa lukumäärän ja ajan
app.get('/info', async (req, res) => {
  const count = await Person.countDocuments({})
  const timestamp = new Date()
  const message = `Count of entries in phonebook is: ${count} people.<br>${timestamp}`
  res.send(message)
})

//Yksittäisen henkilön tietojen etsintä
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).json({ error: 'Ei löydy' })
      }
    })
    .catch(error => next(error))
})

//Yksittäisen henkilön tietojen poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//Henkilön lisäys
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.Name || !body.Number) {
    return response.status(400).json({
      error: 'Either name or number are missing'
    })
  }

  const person = new Person({
    Name: body.Name,
    Number: body.Number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

//Portti asetukset
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})