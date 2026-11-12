const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000; 

const dbConnection = require('./src/helpers/dbConnection');
const mainRoute = require('./src/routes/mainRoute');



app.use(express.json());
app.use(cors())

app.use('/api', mainRoute);

app.get('/',(req,res)=>{
  res.json({"msg":"success"})
})
dbConnection.dbConnection();

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});



