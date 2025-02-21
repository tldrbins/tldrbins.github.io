---
title: "Cloud Enum"
date: 2025-02-21
tags: ["OSINT", "Cloud", "Azure", "AWS", "Google", "Enumeration"]
---

### Cloud Enum

{{< tab set1 tab1 >}}cloud_enum{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
python3 cloud_enum.py -k <KEYWORD>
```

```console {class="sample-code"}
┌──(venv)─(kali㉿kali)-[~/Desktop]
└─$ python3 cloud_enum.py -k example.com

##########################
        cloud_enum
   github.com/initstring
##########################


Keywords:    example.com
Mutations:   /home/kali/Desktop/cloud_enum/enum_tools/fuzz.txt
Brute-list:  /home/kali/Desktop/cloud_enum/enum_tools/fuzz.txt

[+] Mutations list imported: 306 items
[+] Mutated results: 1837 items

++++++++++++++++++++++++++
      amazon checks
++++++++++++++++++++++++++

[+] Checking for S3 buckets
  OPEN S3 BUCKET: http://example.com.s3.amazonaws.com/
      FILES:
      ->http://example.com.s3.amazonaws.com/example.com
...[SNIP]...
      ->http://example.com.s3.amazonaws.com/tmp/
      ->http://example.com.s3.amazonaws.com/tmp/abcd1234/
      ->http://example.com.s3.amazonaws.com/tmp/abcd1234/.htaccess
      ->http://example.com.s3.amazonaws.com/tmp/abcd1234/.htpasswd
...[SNIP]...
```

<small>*Ref: [cloud_enum](https://github.com/initstring/cloud_enum)*</small>

{{< /tabcontent >}}
