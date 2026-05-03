<?php
// Manage services
require 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $service_name = $_POST['service_name'];
    $service_description = $_POST['service_description'];

    $stmt = $pdo->prepare('INSERT INTO services (name, description) VALUES (?, ?)');
    $stmt->execute([$service_name, $service_description]);
}

$services = $pdo->query('SELECT * FROM services')->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Services</title>
</head>
<body>
    <h1>Manage Services</h1>
    <form method="POST">
        <label for="service_name">Service Name:</label>
        <input type="text" id="service_name" name="service_name" required>
        <br>
        <label for="service_description">Service Description:</label>
        <textarea id="service_description" name="service_description" required></textarea>
        <br>
        <button type="submit">Add Service</button>
    </form>
    <h2>Existing Services</h2>
    <ul>
        <?php foreach ($services as $service): ?>
            <li><?php echo htmlspecialchars($service['name']) . ': ' . htmlspecialchars($service['description']); ?></li>
        <?php endforeach; ?>
    </ul>
</body>
</html>