<?php

// This PHP script dynamically generates detailed documentation for your HTML files.
// It reads the content of each HTML file in the directory and provides explanations for each section.

// Function to parse and explain HTML content
define('HTML_DIR', __DIR__);

function explainHtml($htmlContent) {
    $dom = new DOMDocument();
    @$dom->loadHTML($htmlContent);

    $explanations = [];

    // Explain the <html> tag
    $htmlTag = $dom->getElementsByTagName('html');
    if ($htmlTag->length > 0) {
        $explanations[] = "<html>: The root element of the HTML document.";
    }

    // Explain the <head> tag
    $head = $dom->getElementsByTagName('head');
    if ($head->length > 0) {
        $explanations[] = "<head>: Contains metadata, links to stylesheets, and scripts.";
    }

    // Explain the <body> tag
    $body = $dom->getElementsByTagName('body');
    if ($body->length > 0) {
        $explanations[] = "<body>: Contains the visible content of the document.";
    }

    // Explain the <title> tag
    $title = $dom->getElementsByTagName('title');
    if ($title->length > 0) {
        $explanations[] = "<title>: The title of the document, displayed on the browser tab.";
    }

    // Explain <meta> tags
    $metaTags = $dom->getElementsByTagName('meta');
    foreach ($metaTags as $meta) {
        $explanations[] = "<meta>: Metadata about the document, such as charset or viewport settings.";
    }

    // Explain <header>, <footer>, <section>, and <article>
    $sections = ['header', 'footer', 'section', 'article'];
    foreach ($sections as $section) {
        $elements = $dom->getElementsByTagName($section);
        foreach ($elements as $element) {
            $explanations[] = "<$section>: Defines the {$section} section of the document.";
        }
    }

    // Explain <a> tags
    $links = $dom->getElementsByTagName('a');
    foreach ($links as $link) {
        $explanations[] = "<a>: Hyperlink to another page or resource. Href: " . $link->getAttribute('href');
    }

    // Explain <img> tags
    $images = $dom->getElementsByTagName('img');
    foreach ($images as $img) {
        $explanations[] = "<img>: Embeds an image. Src: " . $img->getAttribute('src') . ", Alt: " . $img->getAttribute('alt');
    }

    // Explain <div> and <span>
    $divs = $dom->getElementsByTagName('div');
    foreach ($divs as $div) {
        $explanations[] = "<div>: A container for content, often used for layout.";
    }

    $spans = $dom->getElementsByTagName('span');
    foreach ($spans as $span) {
        $explanations[] = "<span>: An inline container for content, often used for styling.";
    }

    // Explain <form>, <input>, and <button>
    $forms = $dom->getElementsByTagName('form');
    foreach ($forms as $form) {
        $explanations[] = "<form>: Defines a form for user input. Action: " . $form->getAttribute('action') . ", Method: " . $form->getAttribute('method');
    }

    $inputs = $dom->getElementsByTagName('input');
    foreach ($inputs as $input) {
        $explanations[] = "<input>: An input field. Type: " . $input->getAttribute('type') . ", Name: " . $input->getAttribute('name');
    }

    $buttons = $dom->getElementsByTagName('button');
    foreach ($buttons as $button) {
        $explanations[] = "<button>: A clickable button. Text: " . $button->nodeValue;
    }

    return $explanations;
}

// Scan the directory for HTML files
$htmlFiles = glob(HTML_DIR . '/*.html');

if (empty($htmlFiles)) {
    echo "No HTML files found in the directory.";
    exit;
}

// Generate documentation for each HTML file
foreach ($htmlFiles as $file) {
    echo "<h2>Documentation for: " . basename($file) . "</h2>";
    $htmlContent = file_get_contents($file);
    $explanations = explainHtml($htmlContent);

    echo "<ul>";
    foreach ($explanations as $explanation) {
        echo "<li>" . htmlspecialchars($explanation) . "</li>";
    }
    echo "</ul>";
}

// Admin Dashboard Functions and Authentication Codes

// Function to authenticate admin login
function authenticateAdmin($username, $password) {
    // Replace with actual database connection and query
    $adminCredentials = [
        'admin' => 'password123', // Example credentials
    ];

    if (isset($adminCredentials[$username]) && $adminCredentials[$username] === $password) {
        session_start();
        $_SESSION['admin_logged_in'] = true;
        return true;
    }
    return false;
}

// Function to check if admin is logged in
function isAdminLoggedIn() {
    session_start();
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Function to log out admin
function logoutAdmin() {
    session_start();
    session_unset();
    session_destroy();
}

// Function to display admin dashboard
function displayAdminDashboard() {
    if (!isAdminLoggedIn()) {
        echo "<p>Access denied. Please log in as an admin.</p>";
        return;
    }

    echo "<h1>Welcome to the Admin Dashboard</h1>";
    echo "<ul>";
    echo "<li><a href='manage_users.php'>Manage Users</a></li>";
    echo "<li><a href='view_reports.php'>View Reports</a></li>";
    echo "<li><a href='settings.php'>Settings</a></li>";
    echo "<li><a href='logout.php'>Log Out</a></li>";
    echo "</ul>";
}

// Example usage
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'login') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        if (authenticateAdmin($username, $password)) {
            echo "<p>Login successful!</p>";
        } else {
            echo "<p>Invalid credentials. Please try again.</p>";
        }
    } elseif ($_POST['action'] === 'logout') {
        logoutAdmin();
        echo "<p>You have been logged out.</p>";
    }
}

// Display the dashboard
if (isAdminLoggedIn()) {
    displayAdminDashboard();
} else {
    echo "<form method='POST'>";
    echo "<h2>Admin Login</h2>";
    echo "<label for='username'>Username:</label><br>";
    echo "<input type='text' id='username' name='username'><br><br>";
    echo "<label for='password'>Password:</label><br>";
    echo "<input type='password' id='password' name='password'><br><br>";
    echo "<input type='hidden' name='action' value='login'>";
    echo "<button type='submit'>Login</button>";
    echo "</form>";
}

?>