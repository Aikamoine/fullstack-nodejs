const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const { query } = require('express')

/*
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
*/

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello Word!</h1>')
})

app.get('/info', (req, res) => {
    Person.find({}).then(p => {
        res.send('<div><div>Phonebook has info for ' + p.length + ' people</div><div>' + new Date() + '</div></div>')
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(p => {
        res.json(p)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    console.log('get', id)
    Person.findById(id)
        .then(p => {
            if (p) {
                res.json(p)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
    //persons = persons.filter(p => p.id !== id)
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const p = new Person({
        name: body.name,
        date: new Date(),
        number: body.number,
    })
    p.save()
        .then(savedPerson => {
            console.log('added', savedPerson)
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    console.log('put body', body)
    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
    }

    Person.findByIdAndUpdate(
        req.params.id,
        person,
        {new: true , runValidators: true, context: 'query'})
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


