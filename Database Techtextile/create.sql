-- CREATE TABLE M_User (
--   userId VARCHAR(100) PRIMARY KEY ,
--   userName VARCHAR(100) NOT NULL,
--   userEmail VARCHAR(100) UNIQUE NOT NULL,
--   userAddress VARCHAR(100),
--   userPhoneNum VARCHAR(10),
--   userType VARCHAR(20) NOT NULL 
-- );

-- CREATE TABLE ProductVariant (
--   variantId SERIAL PRIMARY KEY,
--   yarnBrand VARCHAR(100),
--   yarnDanier VARCHAR(100),
--   fabricMaterial VARCHAR(100),
--   fabricPrintTech VARCHAR(100),
--   color VARCHAR(25)
-- );

-- CREATE TABLE Category (
--   category_id SERIAL PRIMARY KEY,
--   categoryName VARCHAR(100) NOT NULL,
--   parentCategory_id INT REFERENCES Category (category_id)
-- );

-- CREATE TABLE Marketplace (
--   product_id SERIAL PRIMARY KEY,
--   product_name VARCHAR(100) NOT NULL,
--   product_details VARCHAR(255), 
--   product_image VARCHAR(255),
--   product_price DECIMAL(10, 2) NOT NULL,
--   category_id INT REFERENCES Category (category_id) NOT NULL, 
--   variantId INT REFERENCES ProductVariant (variantId),
--   userId VARCHAR(100) REFERENCES M_User (userId) NOT NULL
-- );

-- CREATE TABLE Orders (
--   order_id SERIAL PRIMARY KEY,
--   orderDeliveryDate DATE NOT NULL,
--   orderPrice DECIMAL(10, 2) NOT NULL,
--   orderStatus VARCHAR(20) NOT NULL,
--   orderPayment VARCHAR(10) NOT NULL,
--   userId VARCHAR(100) REFERENCES M_User (userId)
-- );

-- CREATE TABLE orderDetails (
--   order_id INT NOT NULL REFERENCES Orders(order_id),
--   product_id INT NOT NULL REFERENCES Marketplace (product_id),
--   quantity INT NOT NULL,
--   PRIMARY KEY (order_id, product_id)
-- );


CREATE TABLE UserAccounts (
    user_id VARCHAR(200) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    user_type VARCHAR(10) CHECK (user_type IN ('buyer', 'seller'))
);

CREATE TABLE Addresses (
    address_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    address_type VARCHAR(10) CHECK (address_type IN ('billing', 'shipping')),
    address_first_name VARCHAR(50),
    address_last_name VARCHAR(50),
    address_email VARCHAR(100),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
);

CREATE TABLE Buyers (
    buyer_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    phone_num   BIGINT UNIQUE CHECK (phone_num >= 1000000000 AND phone_num <= 9999999999),
    user_address INT REFERENCES Addresses(address_id)
);

CREATE TABLE Sellers (
    seller_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    business_name VARCHAR(100),
    phone_num   BIGINT UNIQUE CHECK (phone_num >= 1000000000 AND phone_num <= 9999999999),
    business_address INT REFERENCES Addresses(address_id)
   
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    seller_id INT REFERENCES Sellers(seller_id),
    product_type VARCHAR(10) CHECK (product_type IN ('yarn', 'fabric'))
);

CREATE TABLE YarnProducts (
    yarn_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    yarn_material VARCHAR(50),
);

CREATE TABLE FabricProducts (
    fabric_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    fabric_print_tech VARCHAR(50),
    fabric_material VARCHAR(50),
);

CREATE TABLE ProductVariant (
    variant_id SERIAL PRIMARY KEY,
    variant_name VARCHAR(50),
    variant_value VARCHAR(50),
    variant_images_url TEXT,
    product_id INT REFERENCES Products(product_id)
);


CREATE TABLE ShoppingCart (
    cart_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CartItems (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES ShoppingCart(cart_id),
    product_id INT REFERENCES Products(product_id),
    variant_id INT[],
    quantity INT NOT NULL
);



CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    payment_method VARCHAR(50),
    shipping_address_id INT REFERENCES Addresses(address_id),
    order_status VARCHAR(20) CHECK (order_status IN ('pending', 'shipped', 'delivered')),
    order_total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    product_id INT REFERENCES Products(product_id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    variant_id INT[]
);


CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    payment_method VARCHAR(50),
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

