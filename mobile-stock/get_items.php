<?php

// Set the response header to JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mobile_stock";

// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare SQL statement to fetch all items
$sql = "SELECT id, mobileId, brand, model, `condition`, ram, storage, imei, status, batteryHealth, color, purchasePrice, sellingPrice, discount, quantity, restockThreshold, supplier, warranty, purchaseDate, accessories, network, invoice FROM items";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement: ' . $conn->error]);
    exit;
}

// Execute the statement
if ($stmt->execute()) {
    // Bind the result variables
    $stmt->bind_result(
        $id, 
        $mobileId, 
        $brand, 
        $model, 
        $condition, 
        $ram, 
        $storage, 
        $imei, 
        $status, 
        $batteryHealth, 
        $color, 
        $purchasePrice, 
        $sellingPrice, 
        $discount, 
        $quantity, 
        $restockThreshold, 
        $supplier, 
        $warranty, 
        $purchaseDate, 
        $accessories, 
        $network, 
        $invoice
    );

    // Fetch all rows and store them in an array
    $items = [];
    while ($stmt->fetch()) {
        $items[] = [
            'id' => $id,
            'mobileId' => $mobileId,
            'brand' => $brand,
            'model' => $model,
            'condition' => $condition,
            'ram' => $ram,
            'storage' => $storage,
            'imei' => $imei,
            'status' => $status,
            'batteryHealth' => $batteryHealth,
            'color' => $color,
            'purchasePrice' => $purchasePrice,
            'sellingPrice' => $sellingPrice,
            'discount' => $discount,
            'quantity' => $quantity,
            'restockThreshold' => $restockThreshold,
            'supplier' => $supplier,
            'warranty' => $warranty,
            'purchaseDate' => $purchaseDate,
            'accessories' => $accessories,
            'network' => $network,
            'invoice' => base64_encode($invoice) // Convert BLOB to base64 for JSON
        ];
    }

    // Clean the output buffer and return the JSON response
    ob_end_clean();
    echo json_encode(['success' => true, 'data' => $items]);
} else {
    // Clean the output buffer and return the error message
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Error executing SQL statement: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>