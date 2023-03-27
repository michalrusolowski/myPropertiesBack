export interface PropertyEntity {
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
}