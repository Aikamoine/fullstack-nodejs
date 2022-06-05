const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())

let persons = [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        }
    ]

app.get('/', (req, res) => {
    res.send('<h1>Hello Word!</h1>')
})

app.get('/info', (req, res) => {
    const reply = '<div><div>Phonebook has info for ' + persons.length + ' people</div><div>' + new Date() + '</div></div>'
    res.send(reply)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'name already exists'
        })
    }

    person.id = Math.floor(Math.random() * 20000)
    persons = persons.concat(person)
    res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})