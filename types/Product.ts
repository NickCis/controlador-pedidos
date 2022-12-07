export default interface Product {
  amount: number;
  code: {
    plu: string;
    lean: string;
  };
  img: string;
  name: string;
  price: {
    unit: number;
    total: number;
    discount: {
      name: string;
      amount: number;
    }[];
  };
  vat: string;
}
