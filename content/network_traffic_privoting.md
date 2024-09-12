---
title: "Network Traffic Pivoting"
date: 2024-6-26
tags: ["pivot", "chisel", "ssh", "metasploit", "network", "socat", "port forward", "tunneling"]
---

### Tunneling

{{< tab set1 tab1 active >}}Chisel{{< /tab >}}
{{< tab set1 tab2 >}}ssh{{< /tab >}}
{{< tab set1 tab3 >}}socat{{< /tab >}}
{{< tab set1 tab4 >}}metasploit{{< /tab >}}
{{< tab set1 tab5 >}}sliver{{< /tab >}}
{{< tabcontent set1 tab1 >}} 

#### Start a local chisel Server

<div>

```console
# In our local Linux machine
./chisel server --reverse --port <LOCAL_PORT>
```

</div>

#### Ports forwarding

<div>

```console
# In target machine
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:<TARGET_PORT>:127.0.0.1:<TARGET_PORT>
```

```console
# Mutiple ports fowarding, can be different targets in the same subnet
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:8080:172.17.0.2:8080 R:5000:172.17.0.3:5000
```

</div>

#### Socks5

<div>

```console
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```console
# Add to the end of the file
socks5 127.0.0.1 1080
```

```console
# In target machine
./chisel client <LOCAL_IP>:<LOCAL_PORT> R:1080:socks
```

```console
# Usage, in our local machine
proxychains4 curl http://127.0.0.1:1080
```

</div>

<small>*Ref: [chisel](https://github.com/jpillora/chisel)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# SSH port forwarding without spawning a shell
ssh -N -L <TARGET_PORT>:127.0.0.1:<TARGET_PORT> <USER>@<TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
# Any traffic go to port <TARGET_PORT> will be forwarded to <LOCAL_IP>:<TARGET_PORT>
./socat tcp-listen:<TARGET_PORT>,fork tcp:<LOCAL_IP>:<TARGET_PORT> &
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

#### Ports forwarding

<div>

```console
# Add
portfwd add -l <TARGET_PORT> -r 127.0.0.1 -p <TARGET_PORT>
```

```console
# Delete
portfwd delete -l <TARGET_PORT> -r 127.0.0.1 -p <TARGET_PORT>
```

</div>

#### Socks5

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```console
socks5 start
```

</div>

{{< /tabcontent >}}

<br>

