import { Router } from 'express';
import {PropertyRecord} from '../records/property.record';
import { ValidationError } from '../utils/errors';

export const propertyRouter = Router();

propertyRouter
  .get('/:propertyId', async (req, res) => {
    const property = await PropertyRecord.getOne(req.params.propertyId);
    res.json({property})
  })

  .get('/', async (req, res) => {
    const propertiesList = await PropertyRecord.listAll()

    res.json({
      propertiesList
    });
})

  .post('/', async (req, res) => {
    const newProperty = new PropertyRecord(req.body);
    await newProperty.insert();

    res.json(newProperty);
  })

  .delete('/:propertyId', async (req, res) => {
  const property = await PropertyRecord.getOne(req.params.propertyId)

  if(!property) {
    throw new ValidationError('Nieruchomość o podanym Id nie istnieje');
  }

  await property.delete();

  res.end();

})


