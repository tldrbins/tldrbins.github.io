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
dig +noall +answer <DOMAIN> axfr @<TARGET>
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
dig +noall +answer @<TARGET> <DOMAIN>
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 snoopy.htb
```

```console
dig +noall +answer @<TARGET> -x <TARGET>
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 -x 10.10.11.212
```

```console
dig +noall +answer @<TARGET> +short <DOMAIN> any
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 +short snoopy.htb any
ns1.snoopy.htb. ns2.snoopy.htb. 2022032612 3600 1800 604800 86400
ns2.snoopy.htb.
ns1.snoopy.htb.
```

```console
dig +noall +answer @<TARGET> -t NS <DOMAIN>
```

```console {class="sample-code"}
$ dig +noall +answer @10.10.11.212 -t NS snoopy.htb
snoopy.htb.             86400   IN      NS      ns1.snoopy.htb.
snoopy.htb.             86400   IN      NS      ns2.snoopy.htb.
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