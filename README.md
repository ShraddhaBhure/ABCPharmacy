# ABC Pharmacy – Inventory and Sales Management System

The **ABC Pharmacy Inventory and Sales Management System** is a web-based application designed to manage medicine inventory and maintain sales records. It allows users to add medicines, view available stock, search medicines, monitor expiry dates, and record medicine sales through a responsive user interface.

The application is developed using **ASP.NET Core Web API (.NET 8)**, **HTML5**, **CSS3**, and **JavaScript**, with server-side data storage using JSON files. It follows a layered architecture using the Repository Pattern and Dependency Injection to separate API handling, business logic, and data access.

---

## Application Screenshots

<!-- Add your project screenshots here -->

![ABC Pharmacy - Medicine Inventory](/farmacyimages/abcinventory.png
)
![ABC Pharmacy - Sales Records](/farmacyimages/Saleinventory.png)
![ABC Pharmacy - Sales Records](/farmacyimages/addmedicine.png
)
![ABC Pharmacy - Sales Records](/farmacyimages/apiu.png
)
![ABC Pharmacy - Sales Records](/farmacyimages/getapi.png
)
![ABC Pharmacy - Sales Records](/farmacyimages/postapi.png)

---

## Key Features

### 1. Medicine Inventory Management

- **Add Medicine:** Add new medicine details, including full name, notes, expiry date, quantity, price, and brand.
- **View Medicines:** Display available medicines in a structured inventory grid.
- **Medicine Search:** Search medicines by medicine name.
- **Brand Information:** Display the brand associated with each medicine.
- **Stock Management:** Maintain and display the available quantity of each medicine.

### 2. Expiry Date Monitoring

- **Expiry Alerts:** Medicines expiring in less than 30 days are highlighted with a red background.
- **Expiry Tracking:** Display medicine expiry dates in the inventory grid.
- **Visual Indicators:** Help users quickly identify medicines approaching their expiry date.

### 3. Low Stock Management

- **Low Stock Alerts:** Medicines with a quantity below 10 are highlighted with a yellow background.
- **Stock Visibility:** Display the current available quantity in the inventory.
- **Automatic Stock Updates:** Available stock is reduced whenever a sale is successfully recorded.

### 4. Sales Management Module

- **Record Sales:** Select a medicine and enter the quantity sold.
- **Stock Validation:** Validate available stock before processing a sale.
- **Automatic Stock Reduction:** Update medicine inventory after a successful sale.
- **Sales Calculation:** Calculate the total sale amount using the medicine price and quantity sold.
- **Sales History:** Maintain records of previous medicine sales.

### 5. Sales Records

- **View Sales History:** Display previously recorded sales.
- **Sale Details:** Maintain medicine name, quantity sold, unit price, total amount, and sale date/time.
- **Historical Pricing:** Store the unit price at the time of sale so previous sales records remain accurate if the medicine price changes later.

### 6. Responsive User Interface

- **Inventory Dashboard:** View and manage medicine inventory.
- **Sales Screen:** Record sales and view sales history.
- **Responsive Layout:** Support desktop, tablet, and mobile screen sizes.
- **Visual Design:** Use clear navigation, forms, tables, buttons, and status indicators.
- **Pharmacy Branding:** Include a pharmacy logo and browser favicon.

### 7. JSON Data Storage

- **JSON File Storage:** Store application data in JSON files on the server.
- **Medicine Data:** Maintain medicine information in `medicines.json`.
- **Sales Data:** Maintain sales history in `sales.json`.
- **Data Persistence:** Retrieve saved information through API endpoints when the application is loaded.

---

## Architecture

The application follows a simple layered architecture to maintain separation of concerns.

```text
                 Client / Browser
                       |
               HTML, CSS, JavaScript
                       |
                    Fetch API
                       |
              ASP.NET Core Web API
                       |
                   Controllers
                       |
                 Service Layer
                       |
              Repository Interface
                       |
            JsonPharmacyRepository
                       |
                  JSON Files
                 /          \
        medicines.json   sales.json
```

### Project Layers

- **Controllers:** Handle HTTP requests and responses for medicine and sales operations.
- **Service Layer:** Contains business logic, medicine validation, stock validation, and sales calculations.
- **Repository Layer:** Handles reading and writing application data to JSON files.
- **Models:** Define the medicine and sales data structures.
- **DTOs:** Define request data and validation rules.
- **Frontend:** Provides the user interface and communicates with the backend through REST APIs.

### Design Patterns and Principles

- **Repository Pattern:** Separates data access logic from business logic.
- **Dependency Injection:** Injects repository and service implementations through ASP.NET Core's built-in DI container.
- **Separation of Concerns:** Keeps controllers, services, repositories, and frontend responsibilities separate.
- **Interface-Based Design:** Uses interfaces to reduce coupling and make implementations easier to replace.

---

## Tech Stack

| Category | Technology |
|---|---|
| Backend | ASP.NET Core Web API (.NET 8) |
| Frontend | HTML5, CSS3, JavaScript |
| API Communication | REST APIs, Fetch API |
| Data Format | JSON |
| Data Storage | JSON Files |
| Serialization | System.Text.Json |
| Architecture | Layered Architecture |
| Design Pattern | Repository Pattern |
| Dependency Injection | ASP.NET Core Built-in DI |
| API Documentation | Swagger / OpenAPI |
| Development Environment | Visual Studio |

---

## API Endpoints

### Medicine APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Medicines` | Retrieve all medicines |
| GET | `/api/Medicines?search=para` | Search medicines |
| POST | `/api/Medicines` | Add a new medicine |

### Sales APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/Sales` | Retrieve all sales records |
| POST | `/api/Sales` | Record a medicine sale and update stock |

---

## Project Structure

```text
ABCPharmacy/
│
├── Controllers/
│   ├── MedicinesController.cs
│   └── SalesController.cs
│
├── Models/
│   ├── Medicine.cs
│   └── Sale.cs
│
├── DTOs/
│   ├── CreateMedicineRequest.cs
│   └── CreateSaleRequest.cs
│
├── Repositories/
│   ├── IPharmacyRepository.cs
│   └── JsonPharmacyRepository.cs
│
├── Services/
│   ├── IPharmacyService.cs
│   └── PharmacyService.cs
│
├── Data/
│   ├── medicines.json
│   └── sales.json
│
├── wwwroot/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── pharmacylogo.png
│
├── Program.cs
├── ABCPharmacy.csproj
└── README.md
```

---

## Installation

### Prerequisites

1. **.NET 8 SDK:** Install from [Microsoft .NET](https://dotnet.microsoft.com/download/dotnet/8.0).
2. **Visual Studio 2022:** Install with the ASP.NET and web development workload.
3. **Web Browser:** Microsoft Edge, Google Chrome, or any modern browser.

### Steps to Run the Project Locally

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/ABCPharmacy.git
```

**2. Navigate to the Project Directory**

```bash
cd ABCPharmacy
```

**3. Restore Dependencies**

```bash
dotnet restore
```

**4. Build the Application**

```bash
dotnet build
```

**5. Run the Application**

```bash
dotnet run
```

**6. Open the Application**

Open the URL displayed in the terminal.

For example:

- **Pharmacy UI:** `https://localhost:7222/`
- **Swagger UI:** `https://localhost:7222/swagger/index.html`

*Note: The local port may differ depending on your launchSettings.json configuration.*

---

## Application Data

The application stores data in two JSON files inside the `Data` folder.

### medicines.json

Stores medicine details:

- Medicine ID
- Full Name
- Notes
- Expiry Date
- Quantity
- Price
- Brand

### sales.json

Stores sales transaction details:

- Sale ID
- Medicine ID
- Medicine Name
- Quantity Sold
- Unit Price
- Total Amount
- Sale Date and Time

The repository layer manages JSON serialization, deserialization, and file operations.

---

## Business Rules

1. Medicines expiring in less than 30 days are highlighted in red.
2. Medicines with stock below 10 are highlighted in yellow.
3. Medicine search supports searching by medicine name.
4. Medicine price supports two decimal places.
5. A sale cannot be processed if the requested quantity exceeds available stock.
6. A sale is recorded only after medicine and stock validations succeed.
7. Available medicine quantity is reduced after a successful sale.
8. Previous sales retain the unit price recorded at the time of the transaction.

---

## Future Enhancements

- Add medicine update and delete functionality.
- Integrate SQL Server for production-level data storage.
- Implement user authentication and role-based authorization.
- Add expiry notifications and low-stock alerts.
- Add sales reports and date-wise filtering.
- Implement transactional stock updates and concurrency handling.
- Add unit and integration testing.
- Add centralized logging and exception handling.

---

## Author

**Shraddha Bhure**

.NET Developer | C# | ASP.NET Core | Web API | JavaScript

GitHub: [ShraddhaBhure](https://github.com/ShraddhaBhure)
