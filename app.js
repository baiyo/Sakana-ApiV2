const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  credentails: true,
  optionSuccessStatus: 200,
  port: port,
};


const extractor = require('./extractor.js')


const app = express();

app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json('Sakana Api V2 is running 🤙🤟');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

app.get('/getRecentAnime', async (req,res) => {
  try {
    const data = await extractor.scrapeRecentPage({});
    console.log(data);
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Internal Error',
      message: err,
    });
  }
});

app.get('/getVideo/:id', async (req, res) => {
    try {
      console.log("received");
      const id = req.params.id;
  
      const data = await extractor.scrapeAnimeVideoFile({ id: id });
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: 'Internal Error',
        message: err,
      });
    }
});

app.get('/getAnimeDetails/:id', async (req, res) => {
  try {
    console.log("received");
    const id = req.params.id;

    const data = await extractor.scrapeAnimeDetails({ id: id });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Internal Error',
      message: err,
    });
  }
});