CREATE TABLE UserAccounts (
    user_id VARCHAR(200) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number INT,
    user_type VARCHAR(10) CHECK (user_type IN ('buyer', 'seller'))
);

CREATE TABLE Addresses (
    address_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    address_type VARCHAR(10) CHECK (address_type IN ('billing', 'shipping')),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100)
);

CREATE TABLE Buyers (
    buyer_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    address_id INT REFERENCES Addresses(address_id) 
);

CREATE TABLE Sellers (
    seller_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    business_name VARCHAR(100),
    business_address TEXT,
    business_phone_number INT
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    seller_id INT REFERENCES Sellers(seller_id),
    product_type VARCHAR(10) CHECK (product_type IN ('yarn', 'fabric'))
);

CREATE TABLE YarnProducts (
    yarn_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    yarn_type VARCHAR(50),
    yarn_denier VARCHAR(50),
    yarn_color VARCHAR(50),
    yarn_details TEXT
);

CREATE TABLE FabricProducts (
    fabric_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    fabric_type VARCHAR(50),
    fabric_print_tech VARCHAR(50),
    fabric_material VARCHAR(50),
    fabric_color VARCHAR(50),
    fabric_details TEXT
    
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
    quantity INT NOT NULL
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    payment_method VARCHAR(50),
    shipping_address_id INT REFERENCES Addresses(address_id),
    order_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    product_id INT REFERENCES Products(product_id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);


CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);