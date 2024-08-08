const express = require('express');
const cors = require('cors');


const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  credentails: true,
  optionSuccessStatus: 200,
  port: port,
};

const logRequest = (req, res, next) => {
    console.log(`Received a ${req.method} request from ${req.ip}`);
    next();
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logRequest);


app.get('/', (req, res) => {
  res.status(200).json('Sakana Api V2 is running');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
