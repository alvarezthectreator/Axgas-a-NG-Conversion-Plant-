<?php

// Settings Page

// Function to display settings form
function displaySettingsForm() {
    echo "<h1>Settings</h1>";
    echo "<form method='POST'>";
    echo "<label for='site_name'>Site Name:</label><br>";
    echo "<input type='text' id='site_name' name='site_name' value='My Website'><br><br>";
    echo "<label for='admin_email'>Admin Email:</label><br>";
    echo "<input type='email' id='admin_email' name='admin_email' value='admin@example.com'><br><br>";
    echo "<button type='submit'>Save Settings</button>";
    echo "</form>";
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $siteName = $_POST['site_name'] ?? '';
    $adminEmail = $_POST['admin_email'] ?? '';
    echo "<p>Settings saved: Site Name - $siteName, Admin Email - $adminEmail</p>";
}

displaySettingsForm();

?>