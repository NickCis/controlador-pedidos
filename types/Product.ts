export interface Product {
  amount: number;
  code: {
    plu: string;
    lean: string;
    ean: string;
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

export interface ApiProduct {
  code: {
    plu: string;
    ean: string;
  };
  img: string;
  name: string;
  price: string;
}
