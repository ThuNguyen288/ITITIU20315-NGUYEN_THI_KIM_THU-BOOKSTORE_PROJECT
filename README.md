# 📚 Bookstore Project

A comprehensive web-based application designed to manage bookstore operations, including inventory, sales, and customer accounts.

---

## 🚀 Features

- **Book Browsing & Search** – Search by title, author, genre, or ISBN.
- **Inventory Management** – Admins can add, update, or remove books.
- **Sales & Orders Tracking** – View transactions and order history.
- **Customer Management** – Users can register, log in, and track their orders.
- **Admin Dashboard** – Monitor sales, stock levels, and user activity.
- **Authentication & Authorization** – JWT-secured login for admins/customers.
- **Responsive Design** – Works across desktop, tablet, and mobile.

---

## 🛠️ Technologies Used

- **Frontend:** React.js, Next.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Styling:** Tailwind CSS, Material UI

---

## 📁 Project Structure

bookstore_project/
├── backend/ # Express.js REST API
├── frontend/ # Next.js frontend interface
├── mydatabase.sql # SQL dump file for database setup
└── README.md


---

## Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/ThuNguyen288/bookstore_project.git
cd bookstore_project
```

### 2. Install dependencies
``` bash
npm install
```
#### Backend (API routes)
- Located in: `src/app/api/`
- Handles: Authentication, orders, books, users...

#### Frontend (UI)
- Located in: `src/app/page.tsx`, `components/`
- Handles: Login form, dashboard, book catalog...

### 3. Import MySQL database
Ensure MySQL is installed and running.
``` bash
mysql -u root -p

sql

CREATE DATABASE bookstore_db;
EXIT;
```

Then import the data:
``` bash
mysql -u root -p bookstore_db < mydatabase.sql
```

### 4. Configure environment variables
Create a .env file in the backend/ directory:

``` env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookstore_db

JWT_SECRET=your_jwt_secret
TOKEN_EXPIRES_IN=1h

SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUD_PRESET=your_cloudinary_preset
```

### 5. Run the application
``` bash
npm run build
npm start
```


## Usage
Visit http://localhost:3000 in your browser.

Register as a customer to browse and place orders.

Log in as an admin to manage books, orders, and users.


## File for Submission
mydatabase.sql (MySQL export)


📬 Contact
For questions or support:

Email: thuthu2882002@gmail.com
GitHub: ThuNguyen288

