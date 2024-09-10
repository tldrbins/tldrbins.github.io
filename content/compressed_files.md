---
title: "Compressed Files"
date: 2024-6-26
tags: ["compress", "decompress", "extract", "zip", "unzip", "gz", "tar", "rar", "7z", "bz", "Windows", "powershell"]
---

---

<small>*Hint: Always put the zip file inside a new folder before unzip*</small>

{{< tab set1 tab1 active >}}zip{{< /tab >}}
{{< tab set1 tab2 >}}tar.gz{{< /tab >}}
{{< tab set1 tab3 >}}tar{{< /tab >}}
{{< tab set1 tab4 >}}gz{{< /tab >}}
{{< tab set1 tab5 >}}rar{{< /tab >}}
{{< tab set1 tab6 >}}7z{{< /tab >}}
{{< tab set1 tab7 >}}bz{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# zip a file
zip file.zip file
```

```bash
# zip a folder
zip -r folder.zip folder/
```

```bash
# zip a symlink (not the destination file)
zip --symlinks file.zip symlink
```

```bash
# List files without unzip
unzip -l file.zip
```

```bash
# unzip
unzip file.zip
```

```powershell
# unzip (Windows)
Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('C:\ProgramData\file.zip', 'C:\ProgramData\')
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

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

```bash
# Extract filter with wildcard (e.g. .txt)
tar -xvzf file.tar.gz --wildcards '*.txt'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# List files without extract
tar -tf file.tar
```

```bash
# Extract
tar -xvf file.tar
```

```bash
# Extract filter with wildcard (e.g. .txt)
tar -xvf file.tar --wildcards '*.txt'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

<div>

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

<small>*Note: If you want to zip the entire folder, use tar instead*</small>

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```bash
# Extract
unrar e file.rar
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab6 >}}

<div>

```bash
# Install
sudo apt install p7zip-full
```

```bash
# Extract
7z x file.zip
```

```bash
# Show meta data
7z l -slt file.zip
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab7 >}}

<div>

```bash
# Extract and keep original files
bunzip2 -k file.bz2
```

</div>

{{< /tabcontent >}}

<br>
