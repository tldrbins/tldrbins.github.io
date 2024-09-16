---
title: "Compressed Files"
date: 2024-6-26
tags: ["compress", "decompress", "extract", "zip", "unzip", "gz", "tar", "rar", "7z", "bz", "Windows", "powershell"]
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

```console
# zip a file
zip <FILE>.zip <FILE>
```

```console
# zip a folder
zip -r <FOLDER>.zip <FOLDER>/
```

```console
# zip a symlink (not the destination file)
zip --symlinks file.zip <SYMLINK>
```

```console
# List files without unzip
unzip -l <FILE>
```

```console
# unzip
unzip <FILE>
```

```console
# unzip (Windows)
Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('<FILE_PATH>', 'C:\ProgramData\')
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Compress a file
tar -cvzf <FILE>.tar.gz <FILE>
```

```console
# Compress a folder
tar -cvzf <FOLDER>.tar.gz <FOLDER>/
```

```console
# Extract
tar -xvzf <FILE>
```

```console
# Extract filter with wildcard (e.g. .txt)
tar -xvzf <FILE> --wildcards '*.txt'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# List files without extract
tar -tf <FILE>
```

```console
# Extract
tar -xvf <FILE>
```

```console
# Extract filter with wildcard (e.g. .txt)
tar -xvf <FILE> --wildcards '*.txt'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

```console
# Compress file, and keep the original file
gzip -k -r <FILE>
```

```console
# Compress all files individually inside a folder, and keep original files
gzip -k -r <FOLDER>/
```

```console
# Extract
gunzip <FILE>
```

<small>*Note: If you want to zip the entire folder, use tar instead*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

```console
# Extract
unrar e <FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab6 >}}

```console
# Install
sudo apt install p7zip-full
```

```console
# Extract
7z x <FILE>
```

```console
# Show meta data
7z l -slt <FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab7 >}}

```console
# Extract and keep original files
bunzip2 -k <FILE>
```

{{< /tabcontent >}}
