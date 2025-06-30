-- Create database tables for the package forwarding application

-- Users table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    address_line VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'Morocco',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouses table
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    address_line VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip VARCHAR(20),
    phone VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase requests table
CREATE TABLE purchase_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_review', 'pending_payment', 'confirmed', 'purchasing', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_due DECIMAL(10,2),
    items_cost DECIMAL(10,2),
    shipping_fee DECIMAL(10,2),
    service_fee DECIMAL(10,2),
    processing_fee DECIMAL(10,2),
    taxes DECIMAL(10,2),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Purchase request items table
CREATE TABLE purchase_request_items (
    id SERIAL PRIMARY KEY,
    purchase_request_id VARCHAR(50) NOT NULL,
    name VARCHAR(500) NOT NULL,
    url TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    specifications TEXT,
    variant VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
);

-- Purchase request timeline table
CREATE TABLE purchase_request_timeline (
    id SERIAL PRIMARY KEY,
    purchase_request_id VARCHAR(50) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
);

-- Packages table
CREATE TABLE packages (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('expected', 'processing', 'arrived', 'in_transit', 'delivered')),
    tracking_number VARCHAR(100) NOT NULL UNIQUE,
    weight VARCHAR(50),
    dimensions VARCHAR(100),
    estimated_value DECIMAL(10,2),
    shipping_cost DECIMAL(10,2),
    insurance DECIMAL(10,2),
    progress INTEGER DEFAULT 0,
    eta VARCHAR(100),
    carrier VARCHAR(100),
    origin VARCHAR(255),
    destination VARCHAR(255),
    retailer VARCHAR(255),
    shipping_method VARCHAR(100),
    service VARCHAR(100),
    transit_time VARCHAR(100),
    tracking_url TEXT,
    insurance_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Package items table
CREATE TABLE package_items (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL,
    name VARCHAR(500) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    value DECIMAL(10,2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Package timeline table
CREATE TABLE package_timeline (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL,
    status VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Package documents table
CREATE TABLE package_documents (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size VARCHAR(50),
    upload_date DATE NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Payment requests table
CREATE TABLE payment_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('purchase', 'shipping')),
    related_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'processing')),
    paid_date DATE,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment request breakdown table
CREATE TABLE payment_breakdowns (
    id SERIAL PRIMARY KEY,
    payment_request_id VARCHAR(50) NOT NULL,
    item_key VARCHAR(100) NOT NULL,
    item_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_request_id) REFERENCES payment_requests(id) ON DELETE CASCADE
);

-- Payment methods table
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    payment_request_id VARCHAR(50) NOT NULL,
    method VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_request_id) REFERENCES payment_requests(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_purchase_requests_user_id ON purchase_requests(user_id);
CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX idx_purchase_requests_date ON purchase_requests(date);
CREATE INDEX idx_packages_user_id ON packages(user_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_tracking ON packages(tracking_number);
CREATE INDEX idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_related_id ON payment_requests(related_id);
