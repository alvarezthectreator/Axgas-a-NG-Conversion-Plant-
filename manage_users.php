<?php

// Manage Users Page

// Function to fetch all users
function fetchAllUsers() {
    // Replace with actual database query
    return [
        ['id' => 1, 'username' => 'user1', 'email' => 'user1@example.com'],
        ['id' => 2, 'username' => 'user2', 'email' => 'user2@example.com'],
    ];
}

// Display users
function displayUsers() {
    $users = fetchAllUsers();
    echo "<h1>Manage Users</h1>";
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr>";
    foreach ($users as $user) {
        echo "<tr>";
        echo "<td>{$user['id']}</td>";
        echo "<td>{$user['username']}</td>";
        echo "<td>{$user['email']}</td>";
        echo "<td><a href='edit_user.php?id={$user['id']}'>Edit</a> | <a href='delete_user.php?id={$user['id']}'>Delete</a></td>";
        echo "</tr>";
    }
    echo "</table>";
}

displayUsers();

?>