# PostgreSQL Quick Reference

## Common Data Types

```text
INTEGER / BIGINT   Whole numbers and IDs
NUMERIC            Exact decimals, such as prices
TEXT               Text values
BOOLEAN            TRUE or FALSE
DATE / TIMESTAMPTZ Dates and timestamps
UUID               Unique identifiers
JSONB              Queryable JSON data
TEXT[]             Arrays of text
ENUM               Fixed allowed values
```

## Keys and Constraints

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
);
```

- `PRIMARY KEY` uniquely identifies a row.
- `FOREIGN KEY` connects related tables.
- `UNIQUE` prevents duplicate values and creates a unique index.
- `NOT NULL` requires a value.
- `NULL` means unknown or missing; use `IS NULL`, not `= NULL`.

## Table and Data Operations

```sql
CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price NUMERIC);
ALTER TABLE products ADD COLUMN stock INTEGER;
DROP TABLE products;

SELECT * FROM users WHERE name LIKE 'Ali%' ORDER BY name LIMIT 10 OFFSET 20;
INSERT INTO users (email, name) VALUES ('ali@example.com', 'Ali');
UPDATE users SET name = 'Ahmed' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

Useful filters: `WHERE`, `LIKE`, `IN`, `BETWEEN`. Use `ORDER BY` for sorting and `LIMIT/OFFSET` for pagination.

## Relationships and Queries

- **1-to-1:** one row relates to one row.
- **1-to-many:** one user can have many orders.
- **Many-to-many:** use a junction table, such as `student_courses`.

```sql
SELECT users.name, COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name;
```

`INNER JOIN` returns matching rows only. `LEFT JOIN` keeps every row from the left table. Common aggregates are `COUNT`, `SUM`, and `AVG`. A subquery is a query inside another query.

## Performance and Transactions

```sql
CREATE INDEX idx_users_email ON users(email);
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'ali@example.com';

BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT; -- use ROLLBACK if an error occurs
```

- Indexes speed up reads but add write overhead.
- `EXPLAIN` shows the query plan; `EXPLAIN ANALYZE` also executes it.
- ACID transactions provide atomicity, consistency, isolation, and durability.
- Normalization reduces duplicate data: keep values atomic (1NF), fully dependent on the key (2NF), and free of non-key dependencies (3NF).

## PostgreSQL Objects

- **View:** saved query, calculated when read.
- **Materialized view:** saved query result, refreshed manually.
- **Function:** reusable database logic.
- **Trigger:** runs automatically after table events.
- **Sequence:** generates incremental numbers; used by `SERIAL`.
- **Extension:** adds features such as UUID generation or GIS.
- **Domain:** reusable data type with validation.
- **Foreign Data Wrapper/Table:** accesses data from another source.
- **Full-Text Search:** searches and analyzes document text.

```sql
CREATE VIEW expensive_products AS
SELECT name, price FROM products WHERE price > 5000;

CREATE MATERIALIZED VIEW sales_summary AS
SELECT category, SUM(price) AS total FROM products GROUP BY category;

REFRESH MATERIALIZED VIEW sales_summary;
```
