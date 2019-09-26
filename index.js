const Sequelize=require('sequelize');
const sequelize=new Sequelize('postgres://postgres:secret@localhost:5432/postgres');
const express=require('express');
const bodyParser=require('body-parser')

const app=express()
const port= process.env.PORT || 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(bodyParser.json())

const User=sequelize.define('user' , {
    email: {
        type:Sequelize.STRING,
        allowNULL:false,
        unique:true
    }
});

const Task=sequelize.define('task', {
    userId: {
        type:Sequelize.INTEGER,
        allowNULL:false,
    },
    description: {
        type: Sequelize.STRING
    },
    completed: {
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})

sequelize.sync()
    .then(()=>console.log('Tables created successfully'))
    .catch(err=> {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    })

app.post('/echo', (req, res)=>{
    res.json(req.body)
})

app.post('/users' , (req, res, next)=> {
    User.create(req.body)
        .then(user=> res.json(user))
        .catch(err=> next(err))
})

app.get('/users/:userId', (req, res, next)=>{
    User.findByPk(req.params.userId)
    .then(user=>{
        if(!user) {
            res.status(404).end()
        } else {
            res.json(user)
        }
    })
      .catch(next)
})

app.get('/users/:userId/tasks/:taskId', (req, res, next)=>{
    Task.findOne({
        where: {
            id:req.params.taskId,
            userId:req.params.userId
        }
    })
      .then(task=>{
          if(task) {
              return res.json(task)
          }
          return res.status(404).end()
      })
      .catch(next)
})

app.get('/users/:userId/tasks', (req, res, next) => {
    Task.findAll({where: {userId:req.params.userId}})
         .then(tasks=>{
             res.json(tasks)
         })
         .catch(next)
})

app.post('/users/:userId/tasks/', (req, res, next) => {
    User.findByPk(req.params.userId)
        .then(user=> {
            if(!user) {
                return res.status(404).end()
            }
            return Task.create({
                ...req.body,
                userId:req.params.userId
            })
            .then(task=>{
                res.json(task)
            })
        })
        .catch(next)
})

app.delete('/users/:userId/tasks/taskId/', (req, res, next)=>{
     Task.destroy( {
          where: {
              id: req.params.taskId,
              userId: req.params.userId
          }
     })
         .then(destroyedItems=> {
             if(destroyedItems) {
             return res.status(202).end()
             }
             return res.status(404).end()
         } )
         .catch(next)
}
)

app.delete('/users/:userId/', (req, res, next)=>{
    User.destroy({
        where: {id:parseInt(req.params.userId)}})
         .then(()=> {
             return res.status(204).end()
         })
         .catch(next)
})

app.put('/users/:userId', (req, res, next)=>{
    User.findByPk(req.params.userId)
        .then(user=>{
            if(user) {
                return user.update(req.body)
                   .then(user=>res.json(user))
            }
            return res.status(404)
        })
        .catch(next)
})
