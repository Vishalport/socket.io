const express = require('express')
const app = express()
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000
const mongoose =require('mongoose')

mongoose.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }
    console.log("\n==========================================================================================================================\ndb connected.........!!!\n==========================================================================================================================");

    http.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })

    app.use(express.static(__dirname + '/public'))

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    })


    const io = require('socket.io')(http)

    io.on('connection', (socket) => {
        let chat = db.collection('chats');

        console.log('A User Connected...!!')
            socket.on('message', (msg) => {
                console.log(msg);
                chat.find(msg).limit(100).sort({_id:1}).toArray(function(err, res){
                    if(err){
                        throw err;
                    }
                    chat.insert({msg}, function(){
                        socket.broadcast.emit('message', msg);
                    });
                });
            });
        socket.on('disconnect', function () {
            // socket.emit('disconnected');    
            console.log('A USer Disconnected...!!')

        });
    })

});