const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:secret@localhost:5432/postgres'

const User = sequelize.define('user', {
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull defaults to true
    }
  }, {
    // options
  });

  const Message = sequelize.define('message', { body: Sequelize.TEXT });

sequelize.sync() // Calling sync creates the table if it does not already exist
    // Message.create() inserts a new row
    .then(() => Message.create({ body: `This message was created at ${new Date()}` }))
    // Message.findAll() selects all rows, and resolves with an array of objects:
    .then(() => Message.findAll())
    // Log the raw "dataValues" to the console.
    .then(messagesArray => console.log("All messages: ", messagesArray.map(m => m.dataValues)))
    .catch(err => console.error(err))

    // Select all rows. Resolves with a (possibly empty) array
User.findAll().then(...)
// Select all rows where firstName === 'Dave', but only return the first one.
// Resolves with an object or undefined (if no matching rows exist)
User.findOne({where: {firstName: 'Dave'}}).then(...)
// Select a row by its primary key. Resolves with an object or undefined (if no matching rows exist)
User.findByPk(3).then(...)
// A query using a numeric operator
const Op = Sequelize.Op;
User.findAll({
    // WHERE height >= 175
    where: {
        height: {
            [Op.gte]: 175 // gte stands for 'greater than or equal'
        }
    }
}).then(...)

Person.create({
    name: 'Rambow',
    firstname: 'John'
  }).then(john => {
    console.log(john.get({
      plain: true
    }))
  })

  const JobListing = sequelize.define(/* ... */);

sequelize.sync() // Create tables if necessary
    .then(() => JobListing.truncate()) // Delete all existing rows
    .then(() => Promise.all([ // Insert 3 new rows
        JobListing.create({ title: 'Junior JavaScript developer at Travel company', company: 'TravelBee', yearsOfExperience: 1 }),
        JobListing.create({ title: 'Data Scientist [m/w] at Consulting Agency', company: 'Can-O-Developers', yearsOfExperience: 4 }),
        JobListing.create({ title: 'Web-based Game Developer Urgently Needed', company: 'Rubbery Games', yearsOfExperience: 2 })
    ]))
 .catch(console.error)