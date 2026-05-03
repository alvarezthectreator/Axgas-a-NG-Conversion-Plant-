<?php
// Removed session check to allow access without login
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Quotes</title>
</head>
<body>
    <h1>Quotes</h1>
    <ul>
        <?php foreach ($quotes as $quote): ?>
            <li>
                <strong><?php echo htmlspecialchars($quote['name']); ?></strong>:
                <?php echo htmlspecialchars($quote['quote']); ?>
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>