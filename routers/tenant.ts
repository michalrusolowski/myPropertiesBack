import { Router } from 'express';
import { TenantRecord } from '../records/tenant.record';
import { ValidationError } from '../utils/errors';

export const tenantRouter = Router();


tenantRouter
  .get('/:tenantId', async (req, res) => {
    const tenant = await TenantRecord.getOne(req.params.tenantId);
    res.json({tenant})
  })

  .get('/', async (req, res) => {
    const tenantsList = await TenantRecord.listAll()

    res.json({
      tenantsList
    });
  })

  .post('/', async (req, res) => {
    const newTenant = new TenantRecord(req.body);
    await newTenant.insert();

    res.json(newTenant);
  })

  .delete('/:tenantId', async (req, res) => {
    const tenant = await TenantRecord.getOne(req.params.tenantId)

    if(!tenant) {
      throw new ValidationError('Najemca o podanym Id nie istnieje');
    }

    await tenant.delete();

    res.end();

  })