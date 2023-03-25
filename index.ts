import express from "express";
import 'express-async-errors';



const app = express();

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001')
});
