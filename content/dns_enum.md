---
title: "DNS Enum"
date: 2024-6-26
tags: ["Domain", "Reconnaissance", "Enumeration", "DNS", "Dig", "Zone Transfer"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Zone Transfer

```console
dig +noall +answer @<NAME_SERVER> <DOMAIN> AXFR 
```

```console {class="sample-code"}
$ dig +noall +answer snoopy.htb axfr @10.10.11.212
snoopy.htb.             86400   IN      SOA     ns1.snoopy.htb. ns2.snoopy.htb. 2022032612 3600 1800 604800 86400
snoopy.htb.             86400   IN      NS      ns1.snoopy.htb.
snoopy.htb.             86400   IN      NS      ns2.snoopy.htb.
mattermost.snoopy.htb.  86400   IN      A       172.18.0.3
mm.snoopy.htb.          86400   IN      A       127.0.0.1
ns1.snoopy.htb.         86400   IN      A       10.0.50.10
ns2.snoopy.htb.         86400   IN      A       10.0.51.10
postgres.snoopy.htb.    86400   IN      A       172.18.0.2
provisions.snoopy.htb.  86400   IN      A       172.18.0.4
www.snoopy.htb.         86400   IN      A       127.0.0.1
snoopy.htb.             86400   IN      SOA     ns1.snoopy.htb. ns2.snoopy.htb. 2022032612 3600 1800 604800 86400
```

### Domain Discovery

```console
nslookup -querytype=<TYPE> <DOMAIN>
```

```console {class="sample-code"}
$ nslookup -querytype=ANY google.com
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.197.174
Name:   google.com
Address: 2404:6800:4005:823::200e
google.com
        origin = ns1.google.com
        mail addr = dns-admin.google.com
        serial = 780174493
        refresh = 900
        retry = 900
        expire = 1800
        minimum = 60
google.com      nameserver = ns3.google.com.
google.com      nameserver = ns1.google.com.
google.com      nameserver = ns2.google.com.
google.com      nameserver = ns4.google.com.

Authoritative answers can be found from:
```

```console
dig +noall +answer @<NAME_SERVER> <DOMAIN> <TYPE>
```

```console {class="sample-code"}
$ dig +noall +answer @8.8.8.8 google.com ANY
google.com.             300     IN      A       142.250.196.238
google.com.             300     IN      AAAA    2404:6800:4005:80b::200e
---[SNIP]---
```

```console
# Concise Output
dig +noall +answer +short @<NAME_SERVER> <DOMAIN> <TYPE>
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 +short snoopy.htb any
ns1.snoopy.htb. ns2.snoopy.htb. 2022032612 3600 1800 604800 86400
ns2.snoopy.htb.
ns1.snoopy.htb.
```

<br>

```
A     - Address record
AAAA  - IPv6 address record
MX    - Mail exchange record
NS    - Name server record
TXT   - Text record
CNAME - Canonical name record
SOA   - Start of Authority record
ANY   - Retrieves all available record types (not always supported)
```

<br>

```console
# Reverse Lookup
dig +noall +answer @<NAME_SERVER> -x <IP>
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 -x 10.10.11.212
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

### Check DNS Configuration

```console
Get-WmiObject -Namespace "Root\MicrosoftDNS" -Class "MicrosoftDNS_Zone" | Where-Object { $_.ZoneType -eq <ZONE_TYPE> }
```

<br>

```console
0 - Cache Zone
1 - Primary Zone
2 - Secondary Zone
3 - Stub Zone
4 - Forwarder/Conditional Forwarder Zone
```

### Check A Records

```console
(Get-DnsServerZone).ZoneName | ForEach-Object { $zoneName = $_; $aRecords = Get-DnsServerResourceRecord -ZoneName $zoneName -RRType A; if ($aRecords) { $aRecords | Select-Object @{n="ZoneName";e={$zoneName}}, HostName, @{n="IPAddress";e={$_.RecordData.IPv4Address}} } else { [PSCustomObject]@{ZoneName=$zoneName; HostName="No A records found"; IPAddress=""} } }
```

{{< /tabcontent >}}