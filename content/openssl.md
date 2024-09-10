---
title: "Openssl"
date: 2024-7-9
tags: ["openssl", "base64", "cert", "ssl", "certificate signing request", "csr", "pem", "p12", "key", "crt"]
---

---
### Show TLS Certificate from HTTPS web server

<div>

```bash
echo | openssl s_client -showcerts -servername 10.10.11.10 -connect 10.10.11.10:443 2>/dev/null | openssl x509 -inform pem -noout -text
```

</div>

<br>

---

### Certificate

#### Show content of a request

<div>

```bash
openssl req -in request.csr -noout -text
```

</div>

#### Create Client Certificate

<div>

```bash
# Generate a user key
openssl genrsa -out username.key 2048                                                      
```

```bash
# Create a CSR
openssl req -new -key username.key -out username.csr
```

```bash
# Settings
+-----------------------------------------------------------------------------+
| You are about to be asked to enter information that will be incorporated    |
| into your certificate request.                                              |
| What you are about to enter is what is called a Distinguished Name or a DN. |
| There are quite a few fields but you can leave some blank                   |
| For some fields there will be a default value,                              |
| If you enter '.', the field will be left blank.                             |
| -----                                                                       |
| Country Name (2 letter code) [AU]:US                                        |
| State or Province Name (full name) [Some-State]:                            |
| Locality Name (eg, city) []:                                                |
| Organization Name (eg, company) [Internet Widgits Pty Ltd]:COMPANY_NAME     |
| Organizational Unit Name (eg, section) []:COMPANY_NAME                      |
| Common Name (e.g. server FQDN or YOUR name) []:username                     |
| Email Address []:                                                           |
|                                                                             |
| Please enter the following 'extra' attributes                               |
| to be sent with your certificate request                                    |
| A challenge password []:                                                    |
| An optional company name []:                                                |
+-----------------------------------------------------------------------------+
```

```bash
# Sign the .csr with a valid key and cert pair
openssl x509 -req -in username.csr -CA company.cert.pem -CAkey company.key.pem -CAcreateserial -out username.pem -days 1024
```

```bash
# Convert to pfx that Firefox can import
openssl pkcs12 -export -out username.pfx -inkey username.key -in username.pem -certfile company.cert.pem
```

```bash
# Settings
+------------------------------------+
| Enter Export Password:             |
| Verifying - Enter Export Password: |
+------------------------------------+
```

```bash
# Alternative: curl
curl -k --cert username.pem --key username.key https://10.10.11.10
```

</div>

#### Convert .p12 to .key and .crt

<div>

```bash
# Create cert.key
openssl pkcs12 -in cert.p12 -nocerts -out cert.key
```

```bash
# Create cert.crt
openssl pkcs12 -in cert.p12 -clcerts -nokeys -out cert.crt
```

</div>

<br>

---

### Base64 Encode/Decode

<div>

```bash
# base64 encode a file
openssl base64 -in ./file
```

```bash
# base64 decode a file and output to a file
cat b64_file | openssl enc -d -base64 -out ./file
```

</div>

<br>