CREATE OR REPLACE FUNCTION get_related_products(
    IN p_product_id INT,
    IN p_limit INT DEFAULT 5
) RETURNS TABLE (
    related_product_id INTEGER,
    product_name VARCHAR(100),
    price NUMERIC(10, 2),
    image_url TEXT,
    similarity_score DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    WITH product_info AS (
        SELECT * FROM ProductDetailsExtended WHERE product_id = p_product_id
    )
    SELECT 
        pd.product_id,
        pd.product_name,
        pd.price,
        pd.image_url,
        (
            CASE WHEN pd.product_type = pi.product_type THEN 30 ELSE 0 END +
            CASE 
                WHEN pi.product_type = 'yarn' AND pd.product_type = 'yarn' AND pd.yarn_material = pi.yarn_material THEN 45
                WHEN pi.product_type = 'fabric' AND pd.product_type = 'fabric' AND pd.fabric_material = pi.fabric_material THEN 25
                WHEN pi.product_type = 'fabric' AND pd.product_type = 'fabric' AND pd.fabric_print_tech = pi.fabric_print_tech THEN 20
                ELSE 0 
            END +
            CASE WHEN pd.seller_id = pi.seller_id THEN 5 ELSE 0 END +
            (100 - LEAST(ABS(pd.price - pi.price) / pi.price * 100, 100))
        )::DOUBLE PRECISION / 200.0 AS similarity_score
    FROM 
        ProductDetailsExtended pd, product_info pi
    WHERE 
        pd.product_id != p_product_id
    ORDER BY 
        similarity_score DESC, pd.product_id
    LIMIT p_limit;
END;
$$
 LANGUAGE plpgsql;