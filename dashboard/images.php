<?php
// Manage images
require 'db.php';

$upload_dir = '../img/';

// Handle image upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $image_name = $_FILES['image']['name'];
    $image_tmp_name = $_FILES['image']['tmp_name'];
    $target_file = $upload_dir . basename($image_name);

    if (move_uploaded_file($image_tmp_name, $target_file)) {
        $success = 'Image uploaded successfully!';
    } else {
        $error = 'Failed to upload image.';
    }
}

// Handle image deletion
if (isset($_GET['delete'])) {
    $image_to_delete = $upload_dir . basename($_GET['delete']);
    if (file_exists($image_to_delete)) {
        unlink($image_to_delete);
        $success = 'Image deleted successfully!';
    } else {
        $error = 'Image not found.';
    }
}

// Get all images
$images = array_diff(scandir($upload_dir), ['.', '..']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Images</title>
</head>
<body>
    <h1>Manage Images</h1>
    <?php if (isset($success)) echo "<p style='color:green;'>$success</p>"; ?>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

    <h2>Upload New Image</h2>
    <form method="POST" enctype="multipart/form-data">
        <label for="image">Select Image:</label>
        <input type="file" id="image" name="image" required>
        <br>
        <button type="submit">Upload</button>
    </form>

    <h2>Existing Images</h2>
    <ul>
        <?php foreach ($images as $image): ?>
            <li>
                <img src="<?php echo $upload_dir . $image; ?>" alt="<?php echo $image; ?>" style="max-width: 200px;">
                <br>
                <a href="?delete=<?php echo urlencode($image); ?>" onclick="return confirm('Are you sure you want to delete this image?');">Delete</a>
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>