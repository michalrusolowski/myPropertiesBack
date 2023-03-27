import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db"
import {v4 as uuid} from "uuid";
import {FieldPacket} from 'mysql2';
import {PropertyEntity} from '../types';

type PropertyRecordResults = [PropertyEntity[], FieldPacket[]];

export class PropertyRecord implements PropertyEntity {
  id: string;
  name: string;
  street: string;
  place: string;
  postcode: string;
  postOfficeLoc: string;
  community: string;
  plotNo: string;
  landAndMortReg?: string;
  area: number;
  isRent: boolean;
  description?: string;

  constructor(obj: PropertyEntity) {
    if (obj.name.length > 50) {
      throw new ValidationError('Nazwa nieruchomości nie może przekraczać 50 znaków');
    }
    if (obj.street.length > 70) {
      throw new ValidationError('Nazwa ulicy nie może być większa niz 70 znaków');
    }
    if (!obj.place || obj.place.length < 2 || obj.place.length > 35) {
      throw new ValidationError('Nazwa miejscowości musi istnieć. Nie może być większa niż 35 znaków');
    }
    if (!obj.postcode || obj.postcode.length !== 6 ) {
      throw new ValidationError('Kod pocztowy musi zostać podany i składać się z 6 znaków, np. 00-000');
    }
    if (!obj.postOfficeLoc || obj.postOfficeLoc.length < 2 || obj.postOfficeLoc.length > 35) {
      throw new ValidationError('Miejscowość, w której znajduje się poczta musi zostać podana. Nazwa nie może być mniejsza niż 2 i większa niż 35 znaków');
    }
    if (!obj.community.length || obj.community.length < 2 || obj.community.length > 35) {
      throw new ValidationError('Nazwa gminy, w której znajduje się nieruchomość musi zostać podana. Nazwa nie może być mniejsza niz 2 i większa niz 35 znaków');
    }
    if (!obj.plotNo || obj.plotNo.length > 8) {
      throw new ValidationError('Numer działki musi zostać podany i nie może być dłuższy niż 8 znaków');
    }
    if (obj.landAndMortReg.length !== 15) {
      throw new ValidationError('Numer księgi wieczystej musi składać się z 15 znaków, np. GD1T/00000123/4')
    }
    if (typeof obj.area !== 'number' || obj.area > 9999999) {
      throw new ValidationError('Powierzchnia musi zostać wyrażona w formie liczbowej i być nie większa niż 9999999 m2');
    }
    if (obj.description.length > 500) {
      throw new ValidationError('Opis nieruchomości nie może być większy niż 500 znaków')
    }

    this.id = obj.id;
    this.name = obj.name;
    this.street = obj.street;
    this.place = obj.street;
    this.postcode = obj.postcode;
    this.postOfficeLoc = obj.postOfficeLoc;
    this.community = obj.community;
    this.plotNo = obj.plotNo;
    this.landAndMortReg = obj.landAndMortReg;
    this.area = obj.area;
    this.isRent = obj.isRent;
    this.description = obj.description;
  }

  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    } else {
      throw new Error('Nieruchomość została już dodana do bazy. Nie można wykonać tego samego żądania ponownie')
    }

    await pool.execute("INSERT INTO `properties` (`id`, `name`, `street`, `place`, `postcode`, `postOfficeLoc`, `community`, `plotNo`, `landAndMortReq`, `area`,`isRent`, `description`) VALUES(:id, :name, :street, :place, :postcode, :postOfficeLoc, :community, :plotNo, :landAndMortReq, :area, :isRent, :description)", this);

    return this.id;
  }

  static async getOne(id:string): Promise<PropertyRecord | null> {
    const [results] = await pool.execute("SELECT * FROM `properties` WHERE `id` = id", {
      id
    }) as PropertyRecordResults;

  return results.length === 0 ? null : new PropertyRecord(results[0]);

}

  static async listAll(): Promise<PropertyRecord[]> {
    const [results] = await pool.execute("SELECT * FROM `properties`") as PropertyRecordResults;
    return results.map(obj => new PropertyRecord(obj));
}

async delete(): Promise<void> {
    await pool.execute("DELETE FROM `properties` WHERE `id` = :id", {
      id: this.id,
  })
}
}