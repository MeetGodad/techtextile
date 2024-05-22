CREATE TABLE M_User (
  userId SERIAL PRIMARY KEY ,
  userName VARCHAR(100) NOT NULL,
  userEmail VARCHAR(100) UNIQUE NOT NULL,
  userPassword BYTEA NOT NULL,
  userAddress VARCHAR(100),
  userPhoneNum VARCHAR(10),
  userType VARCHAR(20) NOT NULL 
);

CREATE TABLE ProductVariant (
  variantId SERIAL PRIMARY KEY,
  yarnBrand VARCHAR(100),
  yarnDanier VARCHAR(100),
  fabricMaterial VARCHAR(100),
  fabricPrintTech VARCHAR(100),
  color VARCHAR(25)
);

CREATE TABLE Category (
  category_id SERIAL PRIMARY KEY,
  categoryName VARCHAR(100) NOT NULL,
  parentCategory_id INT REFERENCES Category (category_id)
);

CREATE TABLE Marketplace (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  details VARCHAR(255), 
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  category_id INT REFERENCES Category (category_id),
  variantId INT REFERENCES ProductVariant (variantId),
  userId INT REFERENCES M_User (userId)
);

CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,
  orderDeliveryDate DATE NOT NULL,
  orderPrice DECIMAL(10, 2) NOT NULL,
  orderStatus VARCHAR(20) NOT NULL,
  orderPayment VARCHAR(10) NOT NULL,
  userId INT REFERENCES M_User (userId)
);

CREATE TABLE orderDetails (
  order_id INT NOT NULL REFERENCES Orders(order_id),
  product_id INT NOT NULL REFERENCES Marketplace (product_id),
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
