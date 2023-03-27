import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { propertyRouter } from './routers/property';
import { tenantRouter } from './routers/tenant';
import { handleError } from './utils/errors';



const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(json());

app.use('/property', propertyRouter);
app.use('/tenant', tenantRouter)

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001')
});



