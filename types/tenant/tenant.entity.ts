export interface TenantEntity {
  id?: string;
  name: string;
  surname: string;
  phoneNumber?: number;
  eMail?: string;
  startRent: Date;
  endRent: Date;
  propertyId: string;
}