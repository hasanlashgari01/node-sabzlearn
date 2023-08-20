const app = require('./app')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 4000;

// Connect to MongoDB
(async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((err) => {
            console.log(err)
        })
})()

app.get('/', (req, res) => {
    console.log("Token =>",req.header('Authorization').split(' ')[1]);
    res.json({ message: 'Welcome to the server' })
})

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})