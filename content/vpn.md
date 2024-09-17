---
title: "VPN"
date: 2024-7-9
tags: ["VPN", "Internet Key Exchange", "IKE", "Network"]
---

### Enum

```console
# Check with ikeV1
ike-scan -M <TARGET>
```

```console
# Check with ikeV2
ike-scan -M --ikev2 <TARGET>
```

### Connect to VPN

{{< tab set1 tab1 active >}}strongswan{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
sudo apt install strongswan
```

{{< /tabcontent >}}

#### Settings

```console
# Edit /etc/ipsec.secrets
%any : PSK <PASSWORD>
```

<br>

```console
# Edit /etc/ipsec.conf (copy from ike-scan result)
config setup
    charondebug="all"
    uniqueids=yes
    strictcrlpolicy=no

conn testvpn
    authby=secret
    auto=add
    ike=3des-sha1-modp1024!
    esp=3des-sha1!
    type=transport
    keyexchange=ikev1
    left=<LOCAL>
    right=<TARGET>
    rightsubnet=<TARGET>[tcp]
```

#### Connect

```console
# Reset
ipsec restart
```

```console
# Connect
ipsec up testvpn
```
