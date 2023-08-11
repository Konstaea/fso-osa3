const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

//cors käyttöön tällä konfiguraatiolla "toistaiseksi (kohta 3b alku)"
const cors = require('cors')
app.use(cors())

//tehty 3.1-3.7 (ei teht 3.8) +  3.9,
let numbers = [
    {
      id: 1,
      name: "Person1",
      number: "123"
    },
    {
      id: 2,
      name: "Person2",
      number: "456"
    },
    {
      id: 3,
      name: "Person3",
      number: "789"
    }
  ]

//palauttaa listan henkilöistä
app.get('/api/persons', (req, res) => {
    res.json(numbers)
})

//infosivu, joka palauttaa id lukumäärän ja ajan
app.get('/info', (req, res) => {
  const timestamp = new Date()
  const message = "Phonebook has info for " + numbers.length + " people.<br>" + timestamp
  res.send(message)
})

//Yksittäisen henkilön tietojen etsintä
app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = numbers.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({error:'Ei löydy'})
  }
})

//Yksittäisen henkilön tietojen poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  numbers = numbers.filter(person => person.id !== id)

  response.status(204).end()
})

//satunnaisen id:n arpominen isolla välillä käyttäen math.random
const generateId = () => {
  return Math.random(0,10000)
}

//Uuden henkilön lisääminen
app.post('/api/persons', (request, response) => {
  const person = request.body

  //virhe, jos nimi kenttä on tyhjä
  if (!person.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  //virhe, jos numero kenttä on tyhjä
  if (!person.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  //virhe, jos nimi on jo listalla
  const existingAlready = numbers.find(p => p.name === person.name)
  if (existingAlready) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  person.id = generateId()
  console.log(person)
  numbers = numbers.concat(person)
  response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})