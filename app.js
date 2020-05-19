const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const Nexmo = require('nexmo')
const socketio = require('socket.io')

// Init Nexmo
const nexmo = new Nexmo({
    apiKey:'753ca7da' ,
    apiSecret:'wv1MxDFdw06hlUQ7' 
  }, {debug:true})

const app = express()

app.set('view engine','ejs')

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('index')
})

// Catch Form Submit
app.post('/',(req,res)=>{
    // res.send(req.body)
    // console.log(req.body)
    const number = req.body.number
    const text = req.body.text
    
    nexmo.message.sendSms(
        'Vonage SMS API',number,text,{type:'unicode'},  //type:unicode recognizes all characters including emojiS
        (err,responseData)=>{
            if(err){
                console.log(err)
            } else {
                // console.dir(responseData)
                // Get data from response
                const data = {
                    id:responseData.messages[0]['message-id'],
                    number:responseData.messages[0]['to']
                }

                // emit to the client
                io.emit('smsStatus',data)
            }
        }
    )
})

const port = 3000

const server = app.listen(3000,(req,res) => console.log(`Server started on port ${port}`))

// connect to socket.io
const io = socketio(server)
io.on('connection',(socket)=>{
    console.log('connected')
    io.on('disconnect',()=>{
        console.log('disconnected')
    })
})