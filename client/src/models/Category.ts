import { Round } from "./BracketData";

export interface Remark {
  title: string;
  date: string;
  content: string[];
}

export interface Remarks {
  opening?: Remark;
  closing?: Remark;
}

export interface SubCategory {
  size: number;
  name: string;
  hexColor?: string;
  fontHexColor?: string;
}

export interface Category {
  name: string;
  order: number;
  route: string;
  cls: string;
  hexColor: string;
  type: string;
  subCategories?: [SubCategory];
  remarks?: Remarks;
  rounds?: Round[];
}
