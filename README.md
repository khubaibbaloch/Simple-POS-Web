Mobile Inventory Management System
An offline mobile inventory application built using XAMPP.

Note: This project is intended for Windows users. For proper functioning, install XAMPP in its default location (C:\xampp) and place the project folder in the htdocs directory.

Table of Contents
About the Project

Features

Built With

Installation and Setup

Step 1: Install XAMPP

Step 2: Clone the Repository

Step 3: Place PHP Files in XAMPP

XAMPP Configuration

Database Setup

Usage

Contributing

License

Contact

Acknowledgements

About the Project
The Mobile Inventory Management System is designed to help businesses manage their inventory offline. It runs on a local XAMPP server and includes PHP scripts, HTML/CSS/JavaScript files, and SQL scripts to set up your database. This project is completely self-contained and ideal for environments without a constant internet connection.

Features
Offline Access: Work without needing an internet connection.

User-Friendly Interface: Simple and intuitive design.

Comprehensive Reporting: Generate detailed reports on stock, sales, and purchases.

Data Backup & Restore: Easily back up and restore your inventory data.

Built With
XAMPP – Provides Apache, MySQL, PHP, and Perl.

PHP – Server-side scripting.

MySQL – Database management.

HTML5 – Web page structure.

CSS3 – Styling.

JavaScript – Interactivity.

Installation and Setup
Step 1: Install XAMPP
Download XAMPP:
Visit the XAMPP website and download the latest version for Windows.

Install XAMPP:
Run the installer and install XAMPP using the default settings.
Default Installation Directory:

Copy
C:\xampp
Start XAMPP:
After installation, open the XAMPP Control Panel and start the Apache and MySQL services.

Step 2: Clone the Repository
Clone the Repository:
Clone this repository to your local machine using the following command:

bash
Copy
git clone https://github.com/your-username/mobile-inventory-management-system.git
Locate the Project Folder:
Inside the repository, you will find a folder named mobile-stock containing all the PHP files.

Step 3: Place PHP Files in XAMPP
Copy the mobile-stock Folder:
Copy the mobile-stock folder from the cloned repository.

Paste into XAMPP htdocs Directory:
Paste the mobile-stock folder into the htdocs directory of your XAMPP installation.
Default htdocs Directory:

Copy
C:\xampp\htdocs
Access the Application:
Open your browser and navigate to:

Copy
http://localhost/mobile-stock
XAMPP Configuration
Ensure that Apache and MySQL are running in the XAMPP Control Panel.

If you encounter any port conflicts, change the default ports for Apache (e.g., 8080) or MySQL (e.g., 3307) in the XAMPP configuration files.

Database Setup
Open phpMyAdmin:
In your browser, go to:

Copy
http://localhost/phpmyadmin
Create a New Database:
Create a new database named mobile_inventory.

Import the SQL File:
Import the provided SQL file (mobile_inventory.sql) from the database folder into your newly created database.

Update Database Credentials:
Open the config.php file in the mobile-stock folder and update the database credentials if necessary:

php
Copy
$host = 'localhost';
$dbname = 'mobile_inventory';
$username = 'root';
$password = '';
Usage
Access the Application:
Open your browser and navigate to:

Copy
http://localhost/mobile-stock
Log In:
Use the default credentials (if any) to log in and start managing your inventory.

Explore Features:

Add, update, or delete products.

Process sales and generate receipts.

View transaction history and generate reports.

Contributing
Contributions are welcome! If you'd like to improve this project, feel free to fork the repository and submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or feedback, feel free to reach out:

Email: your-email@example.com

GitHub: your-username

Acknowledgements
XAMPP for providing an easy-to-use local server environment.

Bootstrap for the responsive design framework.

phpMyAdmin for database management.# Mobile Inventory Management System  
An offline inventory management application built with XAMPP (Windows only).

> **Note:**  
> - Requires XAMPP installed at `C:\xampp`  
> - Project folder must be placed in `htdocs`

---

## Table of Contents
- [Features](#features)
- [Installation and Setup](#installation-and-setup)
  - [Step 1: Install XAMPP](#step-1-install-xampp)
  - [Step 2: Clone Repository](#step-2-clone-repository)
  - [Step 3: Setup Project](#step-3-setup-project)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Built With](#built-with)
- [Contributing](#contributing)

---

## Features
- **Offline Access:** Work without needing an internet connection.
- **User-Friendly Interface:** Simple and intuitive design.
- **Sales/Purchase Reports:** Generate detailed reports on sales, purchases, and stock.
- **Data Backup & Restore:** Easily back up and restore your inventory data.

---

## Installation and Setup

### Step 1: Install XAMPP
1. **Download XAMPP:**  
   Visit the [XAMPP website](https://www.apachefriends.org/) and download the latest version for Windows.
2. **Install XAMPP:**  
   Run the installer and install XAMPP to the default location:
3. **Start XAMPP:**  
Open the XAMPP Control Panel and start both the Apache and MySQL services.

### Step 2: Clone Repository
1. **Clone the Repository:**  
Open your terminal (Command Prompt, Git Bash, or PowerShell) and run:
```bash
git clone https://github.com/your-username/mobile-inventory-management-system.git
