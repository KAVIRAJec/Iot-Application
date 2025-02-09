const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});