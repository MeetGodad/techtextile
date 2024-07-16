CREATE VIEW product_ratings AS
SELECT 
    p.product_id,
    p.product_name,
    COALESCE(AVG(f.feedback_rating)::numeric(10,2), 0) AS average_rating,
    COUNT(f.feedback_id) AS total_reviews
FROM 
    Products p
LEFT JOIN 
    Feedback f ON p.product_id = f.product_id
GROUP BY 
    p.product_id, p.product_name
    