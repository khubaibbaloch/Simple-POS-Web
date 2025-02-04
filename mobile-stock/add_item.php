<?php

// Set the response header to JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
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

// Function to sanitize input data
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Get and sanitize form data
$mobileId = sanitizeInput($_POST['mobileId'] ?? '');
$brand = sanitizeInput($_POST['brand'] ?? '');
$model = sanitizeInput($_POST['mobile'] ?? '');
$condition = sanitizeInput($_POST['condition'] ?? '');
$ram = intval($_POST['ram'] ?? 0);
$storage = intval($_POST['storage'] ?? 0);
$imei = sanitizeInput($_POST['imei'] ?? '');
$status = sanitizeInput($_POST['status'] ?? '');
$batteryHealth = sanitizeInput($_POST['batteryHealth'] ?? '');
$color = sanitizeInput($_POST['color'] ?? '');
$purchasePrice = floatval($_POST['purchasePrice'] ?? 0);
$sellingPrice = floatval($_POST['sellingPrice'] ?? 0);
$discount = floatval($_POST['discount'] ?? 0);
$quantity = intval($_POST['quantity'] ?? 0);
$restockThreshold = intval($_POST['restockThreshold'] ?? 0);
$supplier = sanitizeInput($_POST['supplier'] ?? '');
$warranty = sanitizeInput($_POST['warranty'] ?? '');
$purchaseDate = sanitizeInput($_POST['purchaseDate'] ?? '');

// Handle checkboxes (arrays)
$accessories = isset($_POST['accessories']) ? implode(',', array_map('sanitizeInput', $_POST['accessories'])) : '';
$network = isset($_POST['network']) ? implode(',', array_map('sanitizeInput', $_POST['network'])) : '';

// Handle file upload (invoice)
$invoice = null;
if (isset($_FILES['invoice']) && $_FILES['invoice']['error'] === UPLOAD_ERR_OK) {
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if ($_FILES['invoice']['size'] > $maxFileSize) {
        echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB']);
        exit;
    }

    if (!in_array($_FILES['invoice']['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Allowed types: JPEG, PNG, PDF']);
        exit;
    }

    $invoice = file_get_contents($_FILES['invoice']['tmp_name']);
}

// Prepare SQL statement
$sql = "INSERT INTO items (mobileId, brand, model, `condition`, ram, storage, imei, status, batteryHealth, color, purchasePrice, sellingPrice, discount, quantity, restockThreshold, supplier, warranty, purchaseDate, accessories, network, invoice) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement: ' . $conn->error]);
    exit;
}

// Bind parameters
$stmt->bind_param("ssssiissssdiiissssssb", 
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

// Handle BLOB data
if ($invoice !== null) {
    $stmt->send_long_data(20, $invoice); // Index 20 for the invoice parameter
}

// Execute the statement
if ($stmt->execute()) {
    ob_end_clean(); // Clean the output buffer
    echo json_encode(['success' => true, 'message' => 'Item added successfully']);
} else {
    ob_end_clean(); // Clean the output buffer
    echo json_encode(['success' => false, 'message' => 'Error executing SQL statement: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>