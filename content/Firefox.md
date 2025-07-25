---
title: "Firefox"
date: 2025-7-25
tags: ["Password Cracking", "Firefox", "Mozilla", "Credential Dumping", "Password"]
---

### Browse History

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Locate sqlite
$firefoxProfile = Get-ChildItem -Path "$env:APPDATA\Mozilla\Firefox\Profiles\" -Directory | Where-Object { $_.Name -like "*.default-release*" }; $historyDb = Join-Path $firefoxProfile.FullName "places.sqlite"; $historyDb
```

{{< /tabcontent >}}

### Extract Saved Passwords

{{< tab set2 tab1 >}}firefox_decrypt{{< /tab >}}
{{< tab set2 tab2 >}}firepwd{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Auto detect path
python3 firefox_decrypt.py
```

```console
# Specify path
python3 firefox_decrypt.py /<PATH>/profiles.ini/
```

<small>*Ref: [firefox_decrypt](https://github.com/unode/firefox_decrypt)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# With key4.db, logins.json in the same directory
python3 firepwd.py
```

<small>*Ref: [firepwd](https://github.com/lclevy/firepwd)*</small>

{{< /tabcontent >}}
