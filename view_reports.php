<?php

// View Reports Page

// Function to fetch reports
function fetchReports() {
    // Replace with actual database query
    return [
        ['id' => 1, 'title' => 'Sales Report', 'date' => '2026-05-01'],
        ['id' => 2, 'title' => 'User Activity Report', 'date' => '2026-05-02'],
    ];
}

// Display reports
function displayReports() {
    $reports = fetchReports();
    echo "<h1>View Reports</h1>";
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Title</th><th>Date</th><th>Actions</th></tr>";
    foreach ($reports as $report) {
        echo "<tr>";
        echo "<td>{$report['id']}</td>";
        echo "<td>{$report['title']}</td>";
        echo "<td>{$report['date']}</td>";
        echo "<td><a href='download_report.php?id={$report['id']}'>Download</a></td>";
        echo "</tr>";
    }
    echo "</table>";
}

displayReports();

?>