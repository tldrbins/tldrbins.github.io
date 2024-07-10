---
title: "VPN"
date: 2024-7-9
tags: ["internet key exchange", "ike", "vpn", "udp"]
---

---
### Enum

```bash
# Check with ikeV1
ike-scan -M 10.10.11.10
```

```bash
# Check with ikeV2
ike-scan -M --ikev2 10.10.10.116
```

### Connect to VPN

#### Tools

```bash
sudo apt install strongswan
```

#### Settings

```bash
# Edit /etc/ipsec.secrets
%any : PSK "password"
```

```bash
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
    left=10.10.14.10
    right=10.10.11.10
    rightsubnet=10.10.11.10[tcp]
```

#### Connect

```bash
# Reset
ipsec restart
```

```bash
# Connect
ipsec up testvpn
```

<br>