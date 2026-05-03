<?php

// Edit User Page

// Function to fetch user details
function fetchUserDetails($id) {
    // Replace with actual database query
    return ['id' => $id, 'username' => 'user' . $id, 'email' => 'user' . $id . '@example.com'];
}

// Display edit form
if (isset($_GET['id'])) {
    $user = fetchUserDetails($_GET['id']);
    echo "<h1>Edit User</h1>";
    echo "<form method='POST'>";
    echo "<label for='username'>Username:</label><br>";
    echo "<input type='text' id='username' name='username' value='{$user['username']}'><br><br>";
    echo "<label for='email'>Email:</label><br>";
    echo "<input type='email' id='email' name='email' value='{$user['email']}'><br><br>";
    echo "<button type='submit'>Save Changes</button>";
    echo "</form>";
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    echo "<p>User updated: Username - $username, Email - $email</p>";
}

?>