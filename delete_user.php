<?php

// Delete User Page

// Function to delete user
function deleteUser($id) {
    // Replace with actual database query
    echo "<p>User with ID $id has been deleted.</p>";
}

if (isset($_GET['id'])) {
    deleteUser($_GET['id']);
} else {
    echo "<p>No user ID provided.</p>";
}

?>