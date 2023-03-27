import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { TenantEntity } from '../types';

type TenantRecordResults = [TenantEntity[], FieldPacket[]];

export class TenantRecord implements TenantEntity {
  id?: string;
  name: string;
  surname: string;
  phoneNumber?: number;
  eMail?: string;
  startRent: Date;
  endRent: Date;
  propertyId: string;

  constructor(obj: TenantEntity) {
    if (obj.name || obj.name.length < 3 || obj.name.length > 20) {
      throw new ValidationError('Imię musi posiadać od 3 do 20 znaków.');
    }
    if (obj.surname || obj.surname.length < 2 || obj.surname.length > 40) {
      throw new ValidationError('Nazwisko musi posiadać od 2 do 40 znaków.');
    }
    if (obj.phoneNumber && typeof obj.phoneNumber !== 'number') {
      throw new ValidationError('Podany numer telefonu jest nieprawidłowy');
    }
    if (obj.eMail && !obj.eMail.includes("@")) {
      throw new ValidationError('Podany e-mail jest nieprawidłowy');
    }

    this.id = obj.id;
    this.name = obj.name;
    this.surname = obj.surname;
    this.phoneNumber = obj.phoneNumber;
    this.eMail = obj.eMail;
    this.startRent = obj.startRent;
    this.endRent = obj.endRent
    this.propertyId = obj.propertyId;
  }

  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    } else {
      throw new Error('Najemca o podanym ID znajduje się już w bazie')
    }

    await pool.execute("INSERT INTO `tenants` (`id`, `name`, `surname`, `phoneNumber`, `eMail`, `startRent`, `endRent`)")

    return this.id;
  }

  static async getOne(id: string): Promise<TenantRecord | null> {
    const [results] = await pool.execute("SELECT * FROM `tenants` WHERE `id` = id", {
      id
    }) as TenantRecordResults;

    return results.length === 0 ? null : new TenantRecord(results[0]);
  }

  static async listAll(): Promise<TenantRecord[]> {
    const [results] = await pool.execute("SELECT * FROM `tenants`") as TenantRecordResults;
    return results.map(obj => new TenantRecord(obj));
  }

  async delete(): Promise<void> {
    await pool.execute("DELETE FROM `tenants` WHERE `id` = :id", {
      id: this.id,
    })
  }
}
