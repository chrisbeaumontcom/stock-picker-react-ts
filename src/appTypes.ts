export type Product = {
  style: string;
  styletext: string;
  sizelist: Array<string>;
  country: string;
  discountPercentage: number;
};
export type Colour = {
  colour: string;
  seq: number;
  thumb: string;
  price: number;
  customerPrice: number;
  sizes: Array<Size>;
};
export type Size = {
  sku: string;
  itemid: string;
  style: string;
  styleid: number;
  colour: string;
  colourcode: string;
  size: string;
  qty: number;
  ordqty: number;
  sizeseq: number;
  price: number;
  customerPrice: number;
  bkorder: number;
  bkorder_date: string;
};
export type LineItem = {
  sku: string;
  itemid: string;
  style: string;
  styleid: number;
  colour: string;
  colourcode: string;
  size: string;
  qty: number;
  sizeseq: number;
  price: number;
  customerPrice: number;
  bkorder: number;
  bkorder_date: string;
  ordqty: number;
  img: string;
  styletext: string;
};
