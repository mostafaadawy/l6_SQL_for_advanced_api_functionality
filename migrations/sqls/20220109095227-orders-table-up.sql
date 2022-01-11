CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id), 
    product_id bigint REFERENCES products(id)
);
-- ALTER TABLE orders ADD COLUMN product_id bigint REFERENCES products(id); 