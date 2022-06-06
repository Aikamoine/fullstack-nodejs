const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack_course:${password}@cluster0.yda7y.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  date: Date,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (process.argv[3]) {
  const number = new Number({
    name: process.argv[3],
    date: new Date(),
    number: process.argv[4],
  })

  number.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Number.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
}


