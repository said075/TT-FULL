const express = require('express');
const cors = require('cors');

const linesRouter = require('./routes/lines');
const stopsRouter = require('./routes/stops');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/lines', linesRouter);
app.use('/stops', stopsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
