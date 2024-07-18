-- 
-- CREATE TABLE Category (
--   category_id SERIAL PRIMARY KEY,
--   categoryName VARCHAR(100) NOT NULL,
--   parentCategory_id INT REFERENCES Category (category_id)
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
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20)
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
    yarn_material VARCHAR(50)
);

CREATE TABLE FabricProducts (
    fabric_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    fabric_print_tech VARCHAR(50),
    fabric_material VARCHAR(50)
);

CREATE TABLE ProductVariant (
    variant_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id),
    variant_attributes VARCHAR(100),
    quantity INT NOT NULL
);

CREATE TABLE Feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    product_id INT REFERENCES Products(product_id),
    feedback_heading VARCHAR(100),
    feedback_text TEXT,
    feedback_rating INT CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    variant_id INT REFERENCES ProductVariant(variant_id),
    quantity INT NOT NULL
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id VARCHAR(200) REFERENCES UserAccounts(user_id),
    payment_method VARCHAR(50),
    payment_id INT REFERENCES Payments(payment_id),
    shipping_address_id INT REFERENCES Addresses(address_id),
    order_status VARCHAR(20) CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'canceled'));
    payment_status_check VARCHAR(20) CHECK (payment_status IN ('pending', 'confirmed' , 'refunded'));
    order_shhipping_cost DECIMAL(10, 2) NOT NULL,
    order_total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    product_id INT REFERENCES Products(product_id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    variant_id INT REFERENCES ProductVariant(variant_id)
    item_status VARCHAR(20) CHECK (item_status IN ('active', 'cancelled', 'refunded'));
);

CREATE TABLE OrderCancellations (
    cancellation_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    canceled_by VARCHAR(200),
    cancellation_reason TEXT,
    canceled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE OrderItemCancellations (
    cancellation_id SERIAL PRIMARY KEY,
    order_item_id INT REFERENCES OrderItems(order_item_id),
    canceled_by VARCHAR(200),
    cancellation_reason TEXT,
    canceled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    payment_method VARCHAR(50),
    payment_amount DECIMAL(10, 2) NOT NULL,
    order_id INT REFERENCES orders(order_id),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP=
    stripe_payment_intent_id SERIAL,
);

CREATE TABLE ShippingDetails (
  shipping_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES Orders(order_id),
  seller_ids INT[],
  carrier_id VARCHAR(100),
  service_code VARCHAR(100),
  shipping_cost DECIMAL(10, 2),
  rate_id VARCHAR(100),
  shipment_id VARCHAR(100),
  estimated_delivery_days DATE,
  is_central_warehouse BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  status VARCHAR(20) chk_status CHECK (status IN ('pending', 'shipped', 'delivered', 'canceled'));
);







-- CREATE OR REPLACE PROCEDURE CancelOrder(
--     p_order_id INT,
--     p_canceled_by VARCHAR(200),
--     p_cancellation_reason TEXT
-- )
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- Check if the order is in a pending state
--     IF EXISTS (SELECT 1 FROM Orders WHERE order_id = p_order_id AND order_status = 'pending') THEN
--         -- Update the order status to 'canceled'
--         UPDATE Orders
--         SET order_status = 'canceled'
--         WHERE order_id = p_order_id;

--         -- Insert a record into the OrderCancellations table
--         INSERT INTO OrderCancellations (order_id, canceled_by, cancellation_reason)
--         VALUES (p_order_id, p_canceled_by, p_cancellation_reason);

--         RAISE NOTICE 'Order % has been canceled', p_order_id;
--     ELSE
--         RAISE NOTICE 'Order % cannot be canceled because it is not pending', p_order_id;
--     END IF;
-- END;
-- $$
-- ;