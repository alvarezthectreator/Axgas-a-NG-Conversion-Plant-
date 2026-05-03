<?php
// View messages
require 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Messages</title>
</head>
<body>
    <h1>Messages</h1>
    <ul>
        <?php foreach ($messages as $message): ?>
            <li>
                <strong><?php echo htmlspecialchars($message['name']); ?></strong>:
                <?php echo htmlspecialchars($message['message']); ?>
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>