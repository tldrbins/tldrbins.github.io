---
title: "SMB Enum"
date: 2025-7-25
tags: ["Kerberos", "Nmap", "SID", "Smbclient", "Mount", "Enumeration", "Smb", "Impacket", "Reconnaissance", "Windows", "ADS"]
---

### SMB Share Enum

{{< tab set1 tab1 >}}nmap{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
sudo nmap --script=smb-enum-shares -p 445 <TARGET>
```

```console {class="sample-code"}
$ sudo nmap --script=smb-enum-shares -p 445 10.10.11.207

Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-25 04:53 GMT
Nmap scan report for 10.10.11.207
Host is up (0.26s latency).

PORT    STATE SERVICE
445/tcp open  microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 7.96 seconds
```

{{< /tabcontent >}}

#### Anonymous Login

{{< tab set2 tab1 >}}smbmap{{< /tab >}}
{{< tab set2 tab2 >}}smbclient{{< /tab >}}
{{< tab set2 tab3 >}}impacket{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
smbmap -H <TARGET> --no-banner
```

```console
smbmap -H <TARGET> -u null --no-banner
```

```console
# List known share
smbmap -H <TARGET> -r <SHARE>
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
smbclient -N -L \\\\<TARGET>\\
```

```console {class="sample-code"}
$ smbclient -N -L \\\\10.10.11.207\\

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        Development     Disk      
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        SYSVOL          Disk      Logon server share 
        Users           Disk      
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.10.11.207 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

```console
# After found an accessible share
smbclient -N \\\\<TARGET>\\<SHARE>\\
```

```console {class="sample-code"}
$ smbclient -N \\\\10.10.11.207\\Development\\
Try "help" to get a list of possible commands.
smb: \>
```

```console
# Fix: Unable to initialize messaging context. protocol negotiation failed: NT_STATUS_CONNECTION_DISCONNECTED
smbclient -N -L \\\\<TARGET>\\ --option='client min protocol=NT1'
```

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

```console
# SID brute, if null auth allowed
impacket-lookupsid test@<DOMAIN> -no-pass
```

```console {class="sample-code"}
$ impacket-lookupsid test@coder.htb -no-pass
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Brute forcing SIDs at coder.htb
[*] StringBinding ncacn_np:coder.htb[\pipe\lsarpc]
[*] Domain SID is: S-1-5-21-2608251805-3526430372-1546376444
498: CODER\Enterprise Read-only Domain Controllers (SidTypeGroup)
500: CODER\Administrator (SidTypeUser)
---[SNIP]---
1000: CODER\DC01$ (SidTypeUser)
1101: CODER\DnsAdmins (SidTypeAlias)
1102: CODER\DnsUpdateProxy (SidTypeGroup)
1106: CODER\e.black (SidTypeUser)
1107: CODER\c.cage (SidTypeUser)
1108: CODER\j.briggs (SidTypeUser)
1109: CODER\l.kang (SidTypeUser)
1110: CODER\s.blade (SidTypeUser)
2101: CODER\PKI Admins (SidTypeGroup)
3601: CODER\Software Developers (SidTypeGroup)
```

{{< /tabcontent >}}

#### Authenticated

{{< tab set3 tab1 >}}smbmap{{< /tab >}}
{{< tab set3 tab2 >}}smbclient{{< /tab >}}
{{< tab set3 tab3 >}}nxc{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
smbmap -H <TARGET> -u '<USER>' -p '<PASSWORD>' --no-banner
```

```console {class="sample-code"}
$ smbmap -H 10.10.11.102 -u 'localadmin' -p 'Secret123' --no-banner
[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                          
                                                                                                                             
[+] IP: 10.10.11.102:445        Name: 10.10.11.102              Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        CertEnroll                                              READ ONLY       Active Directory Certificate Services share
        IPC$                                                    READ ONLY       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share 
        Shared                                                  READ, WRITE
        SYSVOL                                                  READ ONLY       Logon server share 
[*] Closed 1 connections
```

```console
# List known share
smbmap -H <TARGET> -u '<USER>' -p '<PASSWORD>' -r <SHARE> --depth 2 --no-banner
```

```console {class="sample-code"}
$ smbmap -H 10.10.11.102 -u 'localadmin' -p 'Secret123' -r Shared --depth 2 --no-banner
[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                          
                                                                                                                             
[+] IP: 10.10.11.102:445        Name: 10.10.11.102              Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        CertEnroll                                              READ ONLY       Active Directory Certificate Services share
        IPC$                                                    READ ONLY       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share 
        Shared                                                  READ, WRITE
        ./Shared
        dr--r--r--                0 Tue Sep 24 22:04:23 2024    .
        dr--r--r--                0 Tue Sep 24 22:04:23 2024    ..
        dr--r--r--                0 Tue Apr 27 12:09:24 2021    Documents
        dr--r--r--                0 Fri Jul 23 02:14:16 2021    Software
        ./Shared//Documents
        dr--r--r--                0 Tue Apr 27 12:09:24 2021    .
        dr--r--r--                0 Tue Apr 27 12:09:24 2021    ..
        dr--r--r--                0 Thu Apr 29 22:50:33 2021    Analytics
        ./Shared//Documents/Analytics
        dr--r--r--                0 Thu Apr 29 22:50:33 2021    .
        dr--r--r--                0 Thu Apr 29 22:50:33 2021    ..
        fr--r--r--             6455 Thu Apr 29 22:50:33 2021    Big 5.omv
        fr--r--r--             2897 Thu Apr 29 22:50:33 2021    Bugs.omv
        fr--r--r--             2142 Thu Apr 29 22:50:33 2021    Tooth Growth.omv
        fr--r--r--             2841 Tue Sep 24 22:03:16 2024    Whatif.omv
        ./Shared//Software
        dr--r--r--                0 Fri Jul 23 02:14:16 2021    .
        dr--r--r--                0 Fri Jul 23 02:14:16 2021    ..
        fr--r--r--          1447178 Tue Apr 27 05:10:10 2021    7z1900-x64.exe
        fr--r--r--        247215343 Tue Apr 27 05:03:52 2021    jamovi-1.6.16.0-win64.exe
        fr--r--r--         10559784 Tue Apr 27 05:10:08 2021    VNC-Viewer-6.20.529-Windows.exe
        SYSVOL                                                  READ ONLY       Logon server share 
[*] Closed 1 connections
```

```console
# Download file
smbmap -H <TARGET> -u '<USER>' -p '<PASSWORD>' --download '<PATH_TO_FILE>' --no-banner
```

```console {class="sample-code"}
$ smbmap -H 10.10.11.102 -u 'localadmin' -p 'Secret123' --download 'Shared\Documents\Analytics\Whatif.omv' --no-banner     
[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                          
[+] Starting download: Shared\Documents\Analytics\Whatif.omv (2841 bytes)                                                
[+] File output to: /home/kali/10.10.11.102-Shared_Documents_Analytics_Whatif.omv                           
[*] Closed 1 connections
```

```console
# List files with regex pattern
smbmap -H <TARGET> -u '<USER>' -p '<PASSWORD>' -r <SHARE> --depth 2 -A <FILE_PATTERN> --no-banner
```

```console {class="sample-code"}
$ smbmap -H 10.10.11.102 -u 'localadmin' -p 'Secret123' -r Shared --depth 2 -A '.omv' --no-banner 
[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                          
[*] Performing file name pattern match!                                                                                      
[+] Match found! Downloading: Shared/Documents/Analytics/Big 5.omv                                                          
[+] Starting download: Shared\Documents\Analytics\Big 5.omv (6455 bytes)                                                    
[+] File output to: /home/kali/10.10.11.102-Shared_Documents_Analytics_Big 5.omv                               
[+] Match found! Downloading: Shared/Documents/Analytics/Bugs.omv
[+] Starting download: Shared\Documents\Analytics\Bugs.omv (2897 bytes)                                                     
[+] File output to: /home/kali/10.10.11.102-Shared_Documents_Analytics_Bugs.omv                                
[+] Match found! Downloading: Shared/Documents/Analytics/Tooth Growth.omv
[+] Starting download: Shared\Documents\Analytics\Tooth Growth.omv (2142 bytes)                                             
[+] File output to: /home/kali/10.10.11.102-Shared_Documents_Analytics_Tooth Growth.omv                        
[+] Match found! Downloading: Shared/Documents/Analytics/Whatif.omv
[+] Starting download: Shared\Documents\Analytics\Whatif.omv (2841 bytes)                                                   
[+] File output to: /home/kali/10.10.11.102-Shared_Documents_Analytics_Whatif.omv                              
[*] Closed 1 connections
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}


```console
# Password
smbclient -L \\\\<TARGET>\\ -U '<DOMAIN>/<USER>%<PASSWORD>'
```

```console {class="sample-code"}
$ smbclient -L \\\\10.10.11.102\\ -U 'windcorp.htb/localadmin%Secret123'

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        CertEnroll      Disk      Active Directory Certificate Services share
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        Shared          Disk      
        SYSVOL          Disk      Logon server share 
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.10.11.102 failed (Error NT_STATUS_IO_TIMEOUT)
Unable to connect with SMB1 -- no workgroup available
```

```console
# NTLM
smbclient -L \\\\<TARGET>\\ -U '<DOMAIN>/<USER>%<HASH>' --pw-nt-hash
```

```console
# After found an accessible share
smbclient  \\\\<TARGET>\\<SHARE>\\ -U '<DOMAIN>/<USER>%<PASSWORD>'
```

```console {class="sample-code"}
$ smbclient  \\\\10.10.11.102\\Shared\\ -U 'windcorp.htb/localadmin%Secret123'
Try "help" to get a list of possible commands.
smb: \>
```

{{< /tabcontent >}}
{{< tabcontent set3 tab3 >}}

```console
# Spidering Shares
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -M spider_plus
```

```console
# Send a File to the Remote Target
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> --share <SHARE> --put-file <FILE> \\<FILE>
```

```console
# Get a File From the Remote Target
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> --share <SHARE> --get-file \\<FILE> <FILE>
```

{{< /tabcontent >}}

#### Authenticated with Kerberos

{{< tab set4 tab1 >}}impacket{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
impacket-smbclient '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>' -k -no-pass
```

{{< /tabcontent >}}

#### General

```console
# List all files in a share
recurse ON
```

```console
ls
```

```console
# Download all files
mask ""
```

```console
recurse ON
```

```console
prompt OFF
```

```console
mget *
```

#### List Alternate Data Streams (ADS)

```console
allinfo <FILE>
```

```console
# Example Response
>>>stream: [:Password:$DATA], 15 bytes
```

```console
# Download specific data stream
get "<FILE>:Password"
```


---

### Mount SMB Share

{{< tab set5 tab1 >}}Anonymous{{< /tab >}}
{{< tab set5 tab2 >}}Authenticated{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
sudo mount -t cifs //<TARGET>/<SHARE> /mnt
```

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

```console
sudo mount -t cifs -o ro,user='<USER>',password='<PASSWORD>' //<TARGET>/<SHARE> /mnt
```

```console {class="sample-code"}
$ sudo mount -t cifs -o ro,user='localadmin',password='Secret123' //10.10.11.102/Shared /mnt

$ ls /mnt      
Documents  Software
```

{{< /tabcontent >}}


#### Check Write Permission

```console
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done
```

```console
#Check file type you can write
sudo touch {/mnt/,./}test.{dll,exe,ini,lnk}
```

---

### Change SMB Password (with Old Password)

```console
smbpasswd -r <TARGET> -U <USER>
```
