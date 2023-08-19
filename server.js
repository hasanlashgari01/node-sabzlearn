const app = require('./app');
const {default: mongoose} = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;

// Connect to MongoDB
(async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.log(err);
        })
})();

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});