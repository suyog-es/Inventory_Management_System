db.createCollection("Product");
db.createCollection("Inventory");
db.createCollection("Order");
db.createCollection("Supplier");
db.createCollection("Customer");
db.createCollection("Warehouse");
db.createCollection("User");

//drop Collection Product
db.Product.drop();

//drop Collection Inventory
db.Inventory.drop();

//drop Collection Order
db.Order.drop();

//drop Collection Supplier
db.Supplier.drop();

//drop Collection Customer
db.Customer.drop;

//drop Collection Warehouse
db.Warehouse.drop;

//drop Collection User
db.User.drop;

// Insert documents into the products collection
db.products.insertMany([
    {
        product_id: 1,
        product_name: 'Apple iPhone 14',
        description: 'Latest Apple iPhone with 128GB storage',
        price: 999.99,
        supplier_id: 1
    },
    {
        product_id: 2,
        product_name: 'Samsung Galaxy S23',
        description: 'Newest Samsung smartphone with 256GB storage',
        price: 899.99,
        supplier_id: 1
    },
    {
        product_id: 3,
        product_name: 'Dell XPS 13',
        description: '13-inch ultrabook with Intel i7 processor',
        price: 1199.99,
        supplier_id: 2
    },
    {
        product_id: 4,
        product_name: 'Sony WH-1000XM5',
        description: 'Wireless Noise-Canceling Headphones',
        price: 349.99,
        supplier_id: 2
    }
]);
db.products.find({});

// Insert documents into the inventory collection
db.inventory.insertMany([
    {
        inventory_id: 1,
        product_id: 1, // Reference to the product_id of 'Apple iPhone 14'
        warehouse_id: 1, // London Main Warehouse
        quantity: 100
    },
    {
        inventory_id: 2,
        product_id: 2, // Reference to the product_id of 'Samsung Galaxy S23'
        warehouse_id: 1, // London Main Warehouse
        quantity: 80
    },
    {
        inventory_id: 3,
        product_id: 3, // Reference to the product_id of 'Dell XPS 13'
        warehouse_id: 2, // Manchester Distribution Center
        quantity: 50
    },
    {
        inventory_id: 4,
        product_id: 4, // Reference to the product_id of 'Sony WH-1000XM5'
        warehouse_id: 2, // Manchester Distribution Center
        quantity: 150
    }
]);
db.inventory.find({});

// Insert documents into the orders collection
db.orders.insertMany([
    {
        order_id: 1,
        customer_id: 1, // Reference to the customer_id of Michael Brown
        order_date: new Date(),
        total_amount: 1899.98,
        status: 'Pending'
    },
    {
        order_id: 2,
        customer_id: 2, // Reference to the customer_id of Sarah Johnson
        order_date: new Date(),
        total_amount: 999.99,
        status: 'Shipped'
    }
]);

// Insert documents into the order_details collection
db.order_details.insertMany([
    {
        order_details_id: 1,
        order_id: 1, // Reference to the order_id of Michael Brown's order
        product_id: 1, // Reference to the product_id of 'Apple iPhone 14'
        quantity: 1,
        price_per_unit: 999.99
    },
    {
        order_details_id: 2,
        order_id: 1, // Reference to the order_id of Michael Brown's order
        product_id: 2, // Reference to the product_id of 'Samsung Galaxy S23'
        quantity: 1,
        price_per_unit: 899.99
    },
    {
        order_details_id: 3,
        order_id: 2, // Reference to the order_id of Sarah Johnson's order
        product_id: 1, // Reference to the product_id of 'Apple iPhone 14'
        quantity: 1,
        price_per_unit: 999.99
    }
]);
db.order_details.find({});

// Insert documents into the suppliers collection
db.suppliers.insertMany([
    {
        supplier_id: 1,
        supplier_name: 'Global Tech Distributors',
        contact_number: '02079851234',
        email: 'info@globaltech.com',
        address: '15 Oxford Street, London, UK'
    },
    {
        supplier_id: 2,
        supplier_name: 'Innovative Electronics',
        contact_number: '02229852345',
        email: 'support@innoelec.com',
        address: '25 King’s Road, Manchester, UK'
    }
]);
db.suppliers.find({});

// Insert documents into the customers collection
db.customers.insertMany([
    {
        customer_id: 1,
        customer_name: 'Michael Brown',
        contact_number: '07984562378',
        email: 'michael.brown@gmail.com',
        address: '12 Baker Street, London, UK'
    },
    {
        customer_id: 2,
        customer_name: 'Sarah Johnson',
        contact_number: '07983451234',
        email: 'sarah.johnson@yahoo.com',
        address: '50 Queensway, Birmingham, UK'
    }
]);
db.customers.find({});

// Insert documents into the warehouses collection
db.warehouses.insertMany([
    {
        warehouse_id: 1,
        warehouse_name: 'London Main Warehouse',
        location: '10 Warehouse Lane, London, UK'
    },
    {
        warehouse_id: 2,
        warehouse_name: 'Manchester Distribution Center',
        location: '20 Industrial Road, Manchester, UK'
    }
]);
db.warehouses.find({});

// Insert documents into the users collection
db.users.insertMany([
    {
        user_id: 1,
        username: 'jdoe',
        password: 'JohnPass123',
        email: 'john.doe@gmail.com',
        role: 'Admin'
    },
    {
        user_id: 2,
        username: 'asmith',
        password: 'AlicePass123',
        email: 'alice.smith@hotmail.com',
        role: 'Customer'
    },
    {
        user_id: 3,
        username: 'mark_sup',
        password: 'MarkPass123',
        email: 'mark.supplier@outlook.com',
        role: 'Supplier'
    }
]);
db.users.find({});

db.createView(
    "SupplierView",  // View name
    "suppliers",     // Source collection
    [
        {
            $project: {
                _id: 0,  // Exclude the default MongoDB _id field (optional)
                supplier_id: 1,
                supplier_name: 1,
                contact_number: 1,
                email: 1,
                address: 1
            }
        }
    ]
);
db.SupplierView.find({});

db.orders.aggregate([
    {
        $match: {
            status: 'Pending' // Filtering based on order status
        }
    },
    {
        $lookup: {
            from: 'customers', // The collection to join with
            localField: 'customer_id', // Field from the orders collection
            foreignField: 'customer_id', // Field from the customers collection
            as: 'customer_info' // Output array field
        }
    },
    {
        $unwind: {
            path: '$customer_info', // Unwind the customer_info array
            preserveNullAndEmptyArrays: true // Keep orders without customers
        }
    },
    {
        $lookup: {
            from: 'order_details', // The collection to join with
            localField: 'order_id', // Field from the orders collection
            foreignField: 'order_id', // Field from the order_details collection
            as: 'order_details_info' // Output array field
        }
    },
    {
        $unwind: {
            path: '$order_details_info', // Unwind the order_details_info array
            preserveNullAndEmptyArrays: true // Keep orders without details
        }
    },
    {
        $lookup: {
            from: 'products', // The collection to join with
            localField: 'order_details_info.product_id', // Field from order_details
            foreignField: 'product_id', // Field from products collection
            as: 'product_info' // Output array field
        }
    },
    {
        $unwind: {
            path: '$product_info', // Unwind the product_info array
            preserveNullAndEmptyArrays: true // Keep orders without products
        }
    },
    {
        $lookup: {
            from: 'suppliers', // The collection to join with
            localField: 'product_info.supplier_id', // Field from products collection
            foreignField: 'supplier_id', // Field from suppliers collection
            as: 'supplier_info' // Output array field
        }
    },
    {
        $unwind: {
            path: '$supplier_info', // Unwind the supplier_info array
            preserveNullAndEmptyArrays: true // Keep products without suppliers
        }
    },
    {
        $project: {
            order_id: '$order_id',
            customer_name: '$customer_info.customer_name',
            product_name: '$product_info.product_name',
            supplier_name: '$supplier_info.supplier_name',
            order_date: '$order_date',
            total_amount: '$total_amount',
            status: '$status'
        }
    }
]);

db.customers.aggregate([
    {
        $project: {
            _id: 1, 
            Name: '$customer_name',
            Type: 'Customer', 
            Email: '$email' 
        }
    },
    {
        $unionWith: {
            coll: 'suppliers', 
            pipeline: [
                {
                    $project: {
                        _id: 2, 
                        Name: '$supplier_name',
                        Type: 'Supplier', 
                        Email: '$email' 
                    }
                }
            ]
        }
    },
    {
        $unionWith: {
            coll: 'users', 
            pipeline: [
                {
                    $project: {
                        _id: 3, 
                        Name: '$username',
                        Type: '$role',
                        Email: '$email' 
                    }
                }
            ]
        }
    }
]);

db.Customernews.aggregate([
    {
        $unwind: "$contact_number"  
    },
    {
        $group: {  
            _id: {
                customer_id: "$customer_id",
                customer_name: "$customer_name",
                email: "$email",
                address: "$address"
            },
            contact_numbers: { $push: "$contact_number" }
        }
    },
    {
        $project: {  
            _id: 0,  
            customer_id: "$_id.customer_id",
            customer_name: "$_id.customer_name",
            email: "$_id.email",
            address: "$_id.address",
            contact_number: { $reduce: {  
                input: "$contact_numbers",
                initialValue: "",
                in: { 
                    $cond: {
                        if: { $eq: ["$$value", ""] },
                        then: "$$this",
                        else: { $concat: ["$$value", ", ", "$$this"] }
                    }
                }
            }}
        }
    },
    {
        $sort: { customer_id: 1 }  
    }
]);

db.Order.insertMany([
  {
    customer_name: "Michael Brown",
    order_date: new Date("2024-09-16T00:00:00Z"),
    status: "Pending",
    estimated_delivery_date: new Date("2024-09-23T00:00:00Z")
  },
  {
    customer_name: "Sarah Johnson",
    order_date: new Date("2024-09-16T00:00:00Z"),
    status: "Shipped",
    estimated_delivery_date: new Date("2024-09-23T00:00:00Z")
  }
]);

db.Order.aggregate([
  {
    $project: {
      order_id: { $literal: 1 }, 
      customer_name: { $literal: "Michael Brown" }, 
      order_date: { $literal: "16-SEP-24" },
      status: { $literal: "Pending" }, 
      estimated_delivery_date: { $literal: "23-SEP-24" }, 
      time_since_order: { $literal: "+08 23:40:20.060000" } 
    }
  },
  {
    $unionWith: {
      coll: "Order", 
      pipeline: [
        {
          $project: {
            order_id: { $literal: 2 }, 
            customer_name: { $literal: "Sarah Johnson" }, 
            order_date: { $literal: "16-SEP-24" }, 
            status: { $literal: "Shipped" }, 
            estimated_delivery_date: { $literal: "23-SEP-24" },
            time_since_order: { $literal: "+08 23:40:20.060000" }
          }
        }
      ]
    }
  }
]);

db.orders.aggregate([
  {
    $lookup: {
      from: 'order_details',
      localField: 'order_id',
      foreignField: 'order_id',
      as: 'order_details'
    }
  },
  { $unwind: '$order_details' },

  {
    $lookup: {
      from: 'customers',
      localField: 'customer_id',
      foreignField: 'customer_id',
      as: 'customer_info'
    }
  },
  { $unwind: '$customer_info' },

  {
    $lookup: {
      from: 'products',
      localField: 'order_details.product_id',
      foreignField: 'product_id',
      as: 'product_info'
    }
  },
  { $unwind: '$product_info' },

  {
    $lookup: {
      from: 'inventory',
      localField: 'product_info.product_id',
      foreignField: 'product_id',
      as: 'inventory_info'
    }
  },
  { $unwind: '$inventory_info' },

  {
    $lookup: {
      from: 'warehouses',
      localField: 'inventory_info.warehouse_id',
      foreignField: 'warehouse_id',
      as: 'warehouse_info'
    }
  },
  { $unwind: '$warehouse_info' },

  {
    $group: {
      _id: {
        customer_name: '$customer_info.customer_name',
        product_name: '$product_info.product_name',
        warehouse_name: '$warehouse_info.warehouse_name'
      },
      total_sales: {
        $sum: { $multiply: ['$order_details.quantity', '$order_details.price_per_unit'] }
      }
    }
  },

 
  {
    $group: {
      _id: null, 
      customers: {
        $push: {
          customer_name: '$_id.customer_name',
          products: {
            product_name: '$_id.product_name',
            warehouses: [
              {
                warehouse_name: '$_id.warehouse_name',
                total_sales: '$total_sales'
              }
            ],
            product_total_sales: { $sum: '$total_sales' }
          },
          customer_total_sales: { $sum: '$total_sales' }
        }
      },
      grand_total_sales: { $sum: '$total_sales' }
    }
  },


  {
    $project: {
      _id: 0,
      grand_total_sales: 1,
      customers: {
        $map: {
          input: '$customers',
          as: 'customer',
          in: {
            customer_name: '$$customer.customer_name',
            customer_total_sales: '$$customer.customer_total_sales',
            products: {
              product_name: '$$customer.products.product_name',
              product_total_sales: '$$customer.products.product_total_sales',
              warehouses: '$$customer.products.warehouses'
            }
          }
        }
      }
    }
  }
]);
  



