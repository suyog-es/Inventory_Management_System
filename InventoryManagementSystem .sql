-- Drop Product table
DROP TABLE Product CASCADE CONSTRAINTS;

-- Drop Inventory table
DROP TABLE Inventory CASCADE CONSTRAINTS;

-- Drop Order table
DROP TABLE "Order" CASCADE CONSTRAINTS;

-- Drop Supplier table
DROP TABLE Supplier CASCADE CONSTRAINTS;

-- Drop Customer table
DROP TABLE Customer CASCADE CONSTRAINTS;

-- Drop Warehouse table
DROP TABLE Warehouse CASCADE CONSTRAINTS;

-- Drop User table
DROP TABLE "User" CASCADE CONSTRAINTS;

//Creating Table//
-- Create User table
CREATE TABLE "User" (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    role VARCHAR2(20) CHECK (role IN ('Admin', 'Customer', 'Supplier')),
    created_at DATE DEFAULT SYSDATE
);

-- Create Supplier table
CREATE TABLE Supplier (
    supplier_id NUMBER PRIMARY KEY,
    supplier_name VARCHAR2(100) NOT NULL,
    contact_number VARCHAR2(15),
    email VARCHAR2(100),
    address VARCHAR2(200)
);

-- Create Customer table
CREATE TABLE Customer (
    customer_id NUMBER PRIMARY KEY,
    customer_name VARCHAR2(100) NOT NULL,
    contact_number VARCHAR2(15),
    email VARCHAR2(100),
    address VARCHAR2(200)
);

-- Create Product table
CREATE TABLE Product (
    product_id NUMBER PRIMARY KEY,
    product_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    price NUMBER(10, 2) NOT NULL,
    supplier_id NUMBER,
    CONSTRAINT fk_supplier FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id)
);

-- Create Warehouse table
CREATE TABLE Warehouse (
    warehouse_id NUMBER PRIMARY KEY,
    warehouse_name VARCHAR2(100) NOT NULL,
    location VARCHAR2(200) NOT NULL
);

-- Create Inventory table
CREATE TABLE Inventory (
    inventory_id NUMBER PRIMARY KEY,
    product_id NUMBER NOT NULL,
    warehouse_id NUMBER NOT NULL,
    quantity NUMBER(10) CHECK (quantity >= 0),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES Product(product_id),
    CONSTRAINT fk_warehouse FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id)
);

-- Create Order table
CREATE TABLE "Order" (
    order_id NUMBER PRIMARY KEY,
    customer_id NUMBER NOT NULL,
    order_date DATE DEFAULT SYSDATE,
    total_amount NUMBER(10, 2),
    status VARCHAR2(20) CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

// Inserting Value
-- Insert value into User table
INSERT INTO "User" (user_id, username, password, email, role) VALUES (1, 'jdoe', 'JohnPass123', 'john.doe@gmail.com', 'Admin');
INSERT INTO "User" (user_id, username, password, email, role) VALUES (2, 'asmith', 'AlicePass123', 'alice.smith@hotmail.com', 'Customer');
INSERT INTO "User" (user_id, username, password, email, role) VALUES (3, 'mark_sup', 'MarkPass123', 'mark.supplier@outlook.com', 'Supplier');

SELECT * FROM "User";


-- Insert value into Supplier table
INSERT INTO Supplier (supplier_id, supplier_name, contact_number, email, address) 
VALUES (1, 'Global Tech Distributors', '02079851234', 'info@globaltech.com', '15 Oxford Street, London, UK');
INSERT INTO Supplier (supplier_id, supplier_name, contact_number, email, address) 
VALUES (2, 'Innovative Electronics', '02229852345', 'support@innoelec.com', '25 King’s Road, Manchester, UK');

Select * FROM Supplier;

-- Insert value into Customer table
INSERT INTO Customer (customer_id, customer_name, contact_number, email, address) 
VALUES (1, 'Michael Brown', '07984562378', 'michael.brown@gmail.com', '12 Baker Street, London, UK');
INSERT INTO Customer (customer_id, customer_name, contact_number, email, address) 
VALUES (2, 'Sarah Johnson', '07983451234', 'sarah.johnson@yahoo.com', '50 Queensway, Birmingham, UK');

Select * FROM Customer;

-- Insert value into Product table
INSERT INTO Product (product_id, product_name, description, price, supplier_id) 
VALUES (1, 'Apple iPhone 14', 'Latest Apple iPhone with 128GB storage', 999.99, 1);
INSERT INTO Product (product_id, product_name, description, price, supplier_id) 
VALUES (2, 'Samsung Galaxy S23', 'Newest Samsung smartphone with 256GB storage', 899.99, 1);
INSERT INTO Product (product_id, product_name, description, price, supplier_id) 
VALUES (3, 'Dell XPS 13', '13-inch ultrabook with Intel i7 processor', 1199.99, 2);
INSERT INTO Product (product_id, product_name, description, price, supplier_id) 
VALUES (4, 'Sony WH-1000XM5', 'Wireless Noise-Canceling Headphones', 349.99, 2);

Select * FROM Product;

-- Insert value into Warehouse table
INSERT INTO Warehouse (warehouse_id, warehouse_name, location) 
VALUES (1, 'London Main Warehouse', '10 Warehouse Lane, London, UK');
INSERT INTO Warehouse (warehouse_id, warehouse_name, location) 
VALUES (2, 'Manchester Distribution Center', '20 Industrial Road, Manchester, UK');

Select * FROM Warehouse;

-- Insert value into Inventory table
INSERT INTO Inventory (inventory_id, product_id, warehouse_id, quantity) 
VALUES (1, 1, 1, 100); -- 100 iPhones in London Main Warehouse
INSERT INTO Inventory (inventory_id, product_id, warehouse_id, quantity) 
VALUES (2, 2, 1, 80);  -- 80 Samsung Galaxy S23 in London Main Warehouse
INSERT INTO Inventory (inventory_id, product_id, warehouse_id, quantity) 
VALUES (3, 3, 2, 50);  -- 50 Dell XPS 13 in Manchester Distribution Center
INSERT INTO Inventory (inventory_id, product_id, warehouse_id, quantity) 
VALUES (4, 4, 2, 150); -- 150 Sony Headphones in Manchester Distribution Center

Select * FROM Inventory;

-- Insert value into Order table
INSERT INTO "Order" (order_id, customer_id, order_date, total_amount, status) 
VALUES (1, 1, SYSDATE, 1899.98, 'Pending'); -- Order from Michael Brown

INSERT INTO "Order" (order_id, customer_id, order_date, total_amount, status) 
VALUES (2, 2, SYSDATE, 999.99, 'Shipped'); -- Order from Sarah Johnson


Select * FROM Order;

-- Insert value into Order_Details table
INSERT INTO Order_Details (order_details_id, order_id, product_id, quantity, price_per_unit) 
VALUES (1, 1, 1, 1, 999.99); -- 1 iPhone 14 for Michael Brown
INSERT INTO Order_Details (order_details_id, order_id, product_id, quantity, price_per_unit) 
VALUES (2, 1, 2, 1, 899.99); -- 1 Samsung Galaxy S23 for Michael Brown
INSERT INTO Order_Details (order_details_id, order_id, product_id, quantity, price_per_unit) 
VALUES (3, 2, 1, 1, 999.99); -- 1 iPhone 14 for Sarah Johnson

Select* From Order_Details

//StoredProcedure//
CREATE OR REPLACE PROCEDURE update_user (
    p_user_id NUMBER,
    p_username VARCHAR2,
    p_password VARCHAR2,
    p_email VARCHAR2,
    p_role VARCHAR2
) AS
BEGIN
    UPDATE "User"
    SET username = p_username, password = p_password, email = p_email, role = p_role
    WHERE user_id = p_user_id;
END;


//Joins
SELECT 
    o.order_id,
    c.customer_name,
    p.product_name,
    s.supplier_name,
    o.order_date,
    o.total_amount,
    o.status
FROM 
    "Order" o
    INNER JOIN Customer c ON o.customer_id = c.customer_id  -- Inner Join on Customer and Order
    LEFT JOIN Order_Details od ON o.order_id = od.order_id  -- Left Join on Order and Order_Details
    INNER JOIN Product p ON od.product_id = p.product_id  -- Inner Join on Product and Order_Details
    LEFT JOIN Supplier s ON p.supplier_id = s.supplier_id  -- Left Join on Supplier and Product
WHERE 
    o.status = 'Pending';  -- Restriction on the rows selected

//Union//
-- Get customers who have placed orders
SELECT customer_name AS name, 'Customer' AS type, email
FROM Customer c
INNER JOIN "Order" o ON c.customer_id = o.customer_id

UNION

-- Get suppliers who have supplied products
SELECT supplier_name AS name, 'Supplier' AS type, email
FROM Supplier s
INNER JOIN Product p ON s.supplier_id = p.supplier_id;

//nested//
-- Create the type
CREATE OR REPLACE TYPE phone_number_list AS TABLE OF VARCHAR2(15);


-- Create the Customernews table
CREATE TABLE Customernews (
    customer_id NUMBER PRIMARY KEY,
    customer_name VARCHAR2(100) NOT NULL,
    contact_number phone_number_list, -- Nested table for storing multiple phone numbers
    email VARCHAR2(100),
    address VARCHAR2(200)
) NESTED TABLE contact_number STORE AS phone_numbers_store;
/

-- Insert data into the Customernews table
INSERT INTO Customernews (customer_id, customer_name, contact_number, email, address)
VALUES (
    1, 
    'Michael Brown', 
    phone_number_list('07984562378', '02089451234'), 
    'michael.brown@gmail.com', 
    '12 Baker Street, London, UK'
);


SELECT customer_id, customer_name, email, address, 
       contact_number.COLUMN_VALUE AS phone_number
FROM Customernews
     , TABLE(contact_number);


//Time interval
-- Query to calculate estimated delivery dates using temporal features
SELECT 
    o.order_id,
    c.customer_name,
    o.order_date,
    o.status,
    o.order_date + INTERVAL '7' DAY AS estimated_delivery_date, -- Adding 7 days interval to order_date
    SYSTIMESTAMP - o.order_date AS time_since_order -- Calculate the time since the order was placed
FROM 
    "Order" o
    INNER JOIN Customer c ON o.customer_id = c.customer_id
WHERE 
    o.status IN ('Pending', 'Shipped');  -- Restricting to orders that are still in process
//Rollup
-- Query using ROLLUP to aggregate sales totals across customers, products, and warehouses
SELECT 
    c.customer_name,
    p.product_name,
    w.warehouse_name,
    SUM(od.quantity * od.price_per_unit) AS total_sales
FROM 
    "Order" o
    JOIN Order_Details od ON o.order_id = od.order_id
    JOIN Customer c ON o.customer_id = c.customer_id
    JOIN Product p ON od.product_id = p.product_id
    JOIN Inventory i ON p.product_id = i.product_id
    JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
GROUP BY 
    ROLLUP(c.customer_name, p.product_name, w.warehouse_name)
ORDER BY 
    c.customer_name, p.product_name, w.warehouse_name;

     //View Table//
    CREATE VIEW WarehouseView AS
SELECT
    warehouseId,
    name AS warehouse_name,
    location.street AS street_address,
    location.city AS city,
    location.state AS state,
    location.zip AS zip_code,
    capacity,
    manager.name AS manager_name,
    manager.number AS manager_contact
FROM
    Warehouse;
DROP VIEW WarehouseView;



