const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRouter');
require('dotenv').config();

const app = express();


app.use('/api/users' , userRoutes);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});