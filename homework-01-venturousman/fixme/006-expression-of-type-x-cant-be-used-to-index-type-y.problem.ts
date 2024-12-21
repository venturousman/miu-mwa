const productPrices = {
  Apple: 1.2,
  Banana: 0.5,
  Orange: 0.8,
};

type ProductName = 'Apple' | 'Banana' | 'Orange';

const getPrice = (productName: ProductName) => {
  return productPrices[productName];
};
