-- Function: calculate_order_total
CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id INT, p_include_cancelled BOOLEAN)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(quantity * item_price), 0)
    INTO total
    FROM OrderItems
    WHERE order_id = p_order_id
    AND (p_include_cancelled OR item_status != 'canceled');
    
    RETURN total;
END;
$$
 LANGUAGE plpgsql;

-- Function: update_order_totals (Trigger Function)
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
DECLARE
    items_total DECIMAL(10, 2);
BEGIN
    -- Set original values if they are NULL (new order)
    IF NEW.original_shipping_cost IS NULL THEN
        NEW.original_shipping_cost := NEW.current_shipping_cost;
    END IF;

    -- Calculate total price of items
    SELECT COALESCE(SUM(quantity * item_price), 0)
    INTO items_total
    FROM OrderItems
    WHERE order_id = NEW.order_id;

    IF NEW.original_total_price IS NULL THEN
        NEW.original_total_price := items_total + NEW.original_shipping_cost;
    END IF;
    
    -- Ensure current_shipping_cost is set if NULL
    IF NEW.current_shipping_cost IS NULL THEN
        NEW.current_shipping_cost := NEW.original_shipping_cost;
    END IF;

    -- Update current total price
    NEW.current_total_price := (
        SELECT COALESCE(SUM(quantity * item_price), 0)
        FROM OrderItems
        WHERE order_id = NEW.order_id
        AND item_status != 'canceled'
    ) + NEW.current_shipping_cost;
    
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

-- Trigger: order_totals_insert_trigger
Drop TRIGGER IF EXISTS order_totals_insert_trigger ON Orders;
CREATE TRIGGER order_totals_insert_trigger
BEFORE INSERT ON Orders
FOR EACH ROW
EXECUTE FUNCTION update_order_totals();

-- Trigger: order_totals_update_trigger
Drop TRIGGER IF EXISTS order_totals_update_trigger ON Orders;
CREATE TRIGGER order_totals_update_trigger
BEFORE UPDATE ON Orders
FOR EACH ROW
EXECUTE FUNCTION update_order_totals();

-- Function: update_order_totals_on_item_change (Trigger Function)
CREATE OR REPLACE FUNCTION update_order_totals_on_item_change()
RETURNS TRIGGER AS $$
DECLARE
    items_total DECIMAL(10, 2);
BEGIN
    -- Calculate the new total excluding cancelled items
    SELECT COALESCE(SUM(quantity * item_price), 0)
    INTO items_total
    FROM OrderItems
    WHERE order_id = NEW.order_id
    AND item_status != 'canceled';

    -- Update the order with the new total
    UPDATE Orders
    SET current_total_price = items_total + current_shipping_cost
    WHERE order_id = NEW.order_id;
    
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

-- Trigger: order_item_update_trigger
Drop TRIGGER IF EXISTS order_item_update_trigger ON OrderItems;
CREATE TRIGGER order_item_update_trigger
AFTER UPDATE OF item_status, quantity, item_price ON OrderItems
FOR EACH ROW
EXECUTE FUNCTION update_order_totals_on_item_change();
