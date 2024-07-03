---
title: "Compressed Files"
date: 2024-6-26
tags: ["compress", "decompress", "extract", "zip", "unzip", "gz", "tar"]
---

---
### zip

```bash
# zip a file
zip file.zip file
```

```bash
# zip a folder
zip -r folder.zip folder/
```

```bash
# unzip
unzip file.zip
```

<small>*Note: Always put the zip file inside a new folder before unzip*</small>

---

### tar.gz

```bash
# Compress a file
tar -cvzf file.tar.gz file
```

```bash
# Compress a folder
tar -cvzf folder.tar.gz folder/
```

```bash
# Extract
tar -xvzf file.tar.gz
```

<small>*Note: Always put the zip file inside a new folder before Extract*</small>

---

### gz

```bash
# Compress file, and keep the original file
gzip -k -r file
```

```bash
# Compress all files individually inside a folder, and keep original files
gzip -k -r folder/
```

```bash
# Extract
gunzip file.gz
```

<small>*Note: Always put the zip file inside a new folder before unzip*</small>
<br>
<small>*Note: If you want to zip the entire folder, use tar instead*</small>

---

### rar

```bash
# Extract
unrar e file.rar
```

<small>*Note: Always put the zip file inside a new folder before unzip*</small>