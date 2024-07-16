CREATE VIEW ProductDetailsExtended AS
SELECT 
    p.product_id,
    p.product_name,
    p.product_description,
    p.price,
    p.image_url,
    p.seller_id,
    p.product_type,
    y.yarn_material,
    f.fabric_print_tech,
    f.fabric_material,
    s.business_name AS seller_name
FROM 
    Products p
LEFT JOIN YarnProducts y ON p.product_id = y.product_id
LEFT JOIN FabricProducts f ON p.product_id = f.product_id
LEFT JOIN Sellers s ON p.seller_id = s.seller_id;