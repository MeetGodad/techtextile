
-- Update the Orders table to include the following columns

ALTER TABLE Orders
ADD COLUMN original_shipping_cost DECIMAL(10, 2),
ADD COLUMN original_total_price DECIMAL(10, 2),
ADD COLUMN current_shipping_cost DECIMAL(10, 2),
ADD COLUMN current_total_price DECIMAL(10, 2);





CREATE OR REPLACE FUNCTION update_order_and_shipping_status_if_all_items_canceled()
RETURNS TRIGGER AS $$
DECLARE
    existing_cancellation BOOLEAN;
    aggregated_canceled_by TEXT;
    aggregated_cancellation_reason TEXT;
BEGIN
    -- Check if all items for the order are canceled
    IF NOT EXISTS (
        SELECT 1
        FROM OrderItems
        WHERE order_id = NEW.order_id
        AND item_status <> 'cancelled'
    ) THEN
        -- Update Orders table
        UPDATE Orders
        SET order_status = 'canceled',
            current_total_price = 0,
            current_shipping_cost = 0
        WHERE order_id = NEW.order_id;

        -- Check if a cancellation record already exists
        SELECT EXISTS (
            SELECT 1 FROM OrderCancellations WHERE order_id = NEW.order_id
        ) INTO existing_cancellation;

        -- Aggregate cancellation information
        SELECT 
            MAX(c.canceled_by),
            STRING_AGG(DISTINCT c.cancellation_reason, ' | ')
        INTO
            aggregated_canceled_by,
            aggregated_cancellation_reason
        FROM OrderItems o
        LEFT JOIN OrderItemCancellations c ON o.order_item_id = c.order_item_id
        WHERE o.order_id = NEW.order_id
        GROUP BY o.order_id;

        -- Insert or update OrderCancellations
        IF existing_cancellation THEN
            UPDATE OrderCancellations
            SET cancellation_reason = aggregated_cancellation_reason,
                canceled_by = aggregated_canceled_by,
                canceled_at = CURRENT_TIMESTAMP
            WHERE order_id = NEW.order_id;
        ELSE
            INSERT INTO OrderCancellations (order_id, canceled_by, cancellation_reason)
            VALUES (NEW.order_id, aggregated_canceled_by, aggregated_cancellation_reason);
        END IF;

        -- Update shipping details status to 'canceled'
        UPDATE ShippingDetails
        SET status = 'canceled'
        WHERE order_id = NEW.order_id;
    END IF;

    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;




---------Trigger to call the function----------


DROP TRIGGER IF EXISTS update_order_status_on_item_cancellation ON OrderItems;

CREATE TRIGGER update_order_status_on_item_cancellation
AFTER UPDATE OF item_status ON OrderItems
FOR EACH ROW
WHEN (NEW.item_status = 'cancelled')
EXECUTE FUNCTION update_order_and_shipping_status_if_all_items_canceled();