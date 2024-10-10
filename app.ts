import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express'
import '@feathersjs/transport-commons';
import socketio from '@feathersjs/socketio'
// This is the interface for the message data
interface Message {
  id?: number;
  text: string;
}

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  messages: Message[] = [];

  async find () {
    // Just return all our messages
    return this.messages;
  }

  async create (data: Pick<Message, 'text'>) {
    // The new message is the data text with a unique identifier added
    // using the messages length since it changes whenever we add one
    const message: Message = {
      id: this.messages.length,
      text: data.text
    }

    // Add new message to the list
    this.messages.push(message);

    return message;
  }
}

//creating an instance for feathers
const app = express(feathers())

// Express middleware to parse HTTP JSON bodies
app.use(express.json())
// Express middleware to parse URL-encoded params
app.use(express.urlencoded({extended:true}))
// Express middleware to to host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
//using socketio
app.configure(socketio())
//Register the message service on the route
app.use('/messages', new MessageService())
// Express middleware with a nicer error handler
app.use(express.errorHandler())



// // Register the message service on the Feathers application
// app.use('messages', new MessageService());

app.on('connection', (connection)=>{
    app.channel('everybody').join(connection)
})

// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));


//make the server listen
app.listen(3000, ()=>{
    console.log("server is listening at 3000")
})



// // Log every time a new message has been created
// app.service('messages').on('created', (message: Message) => {
//   console.log('A new message has been created', message);
// });

// A function that creates messages and then logs
// all existing messages on the service
// const main = async () => {
//   // Create a new message on our message service
//   await app.service('messages').create({
//     text: 'Hello Feathers'
//   });

//   // And another one
//   await app.service('messages').create({
//     text: 'Hello again'
//   });
  
//   // Find all existing messages
//   const messages = await app.service('messages').find();

//   console.log('All messages', messages);
// };

// main();


app.service('messages').create({
    text: 'Hello world from the server'
  });