CREATE TABLE Buyer (
  buyer_id SERIAL PRIMARY KEY,
  buyerName VARCHAR(100),
  buyerPassword BYTEA NOT NULL,
  buyerEmail VARCHAR(100) UNIQUE,
  buyerAddress VARCHAR(100),
  buyerPhoneNum VARCHAR(10),
  order_id INT
   CONSTRAINT FK_Buyer_Order FOREIGN KEY  (order_id) REFERENCES Order (order_id)
);

CREATE TABLE Marketplace (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  details TEXT,
  image TEXT,
  yarnBrand VARCHAR(100),
  price DECIMAL(10, 2),
  yarnDanier VARCHAR(100),
  fabricMaterial VARCHAR(100),
  fabricPrintTech VARCHAR(100),
  category_id INT,
  CONSTRAINT FK_Marketplace_Category FOREIGN KEY (category_id) REFERENCES Category (category_id)
);

CREATE TABLE Seller (
  seller_id SERIAL PRIMARY KEY,
  sellerName VARCHAR(100),
  sellerPassword BYTEA NOT NULL,
  sellerEmail VARCHAR(100) UNIQUE,
  sellerProducts TEXT,
  sellerPhoneNum VARCHAR(10)
);

CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,
  orderDeliveryDate DATE,
  orderPrice DECIMAL(10, 2),
  orderStatus VARCHAR(10),
  buyerAddress VARCHAR(100),
  orderPayment VARCHAR(5),
  orderConfirm BOOLEAN,
  sellerProducts TEXT,
  sellerName VARCHAR(100),
  buyer_id INT,
  CONSTRAINT FK_Orders_Buyer FOREIGN KEY (buyer_id) REFERENCES Buyer (buyer_id),
  CONSTRAINT FK_Orders_SellerName FOREIGN KEY (sellerName) REFERENCES Seller (sellerName)
  CONSTRAINT FK_Order_BuyerAddress FOREIGN KEY (buyerAddress) REFERENCES Buyer (buyerAddress)
);

CREATE TABLE ShoppingCart (
  product_id INT,
  buyer_id INT,
  PRIMARY KEY (product_id, buyer_id),
  CONSTRAINT FK_ShoppingCart_Product FOREIGN KEY (product_id) REFERENCES Marketplace (product_id),
  CONSTRAINT FK_ShoppingCart_Buyer FOREIGN KEY (buyer_id) REFERENCES Buyer (buyer_id)
);

CREATE TABLE MarketplaceSeller (
  seller_id INT,
  product_id INT,
  PRIMARY KEY (seller_id, product_id),
  CONSTRAINT FK_MarketplaceSeller_Seller FOREIGN KEY (seller_id) REFERENCES Seller (seller_id),
  CONSTRAINT FK_MarketplaceSeller_Product FOREIGN KEY (product_id) REFERENCES Marketplace (product_id)
);

CREATE TABLE MarketplaceBuyer (
  buyer_id INT,
  product_id INT,
  PRIMARY KEY (buyer_id, product_id),
  CONSTRAINT FK_MarketplaceBuyer_Buyer FOREIGN KEY (buyer_id) REFERENCES Buyer (buyer_id),
  CONSTRAINT FK_MarketplaceBuyer_Product FOREIGN KEY (product_id) REFERENCES Marketplace (product_id)
);

CREATE TABLE Category (
  category_id SERIAL PRIMARY KEY,
  categoryName VARCHAR(100),
  parentCategory_id INT,
  CONSTRAINT FK_Category_ParentCategory FOREIGN KEY (parentCategory_id) REFERENCES Category (category_id)
);