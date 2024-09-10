---
title: "SSH"
date: 2024-6-26
tags: ["ssh", "private key", "public key", "id_rsa", "ppk", "pem", "openssh"]
---

---
### Check SSH version

[openssh-server (ubuntu)](https://packages.ubuntu.com/search?keywords=openssh-server)

[openssh-server (debian)](https://packages.debian.org/search?keywords=openssh-server)

### Config Location

<div>

```bash
/etc/ssh/sshd_config
```

```bash
# Grep contents
grep -Ev "^#" /etc/ssh/sshd_config | grep .
```

</div>

<br>

---

### Generate SSH Key

<div>

```bash
ssh-keygen
```

```bash
#Set filename, leave passphase blank
./id_rsa
```

```bash
#After Creation
chmod 600 id_rsa
```

</div>

### Check Public Key

<div>

```bash
ssh-keygen -l -f id_rsa
```

</div>

### Generate no passphrase SSH key from encrypted key

<div>

```bash
openssl rsa -in id_rsa_encrypted -out ./id_rsa
```

</div>

### Convert .ppk to .pem format

<div>

```bash
# Install
sudo apt install putty-tools
```

```bash
# Convert to private key in pem format
puttygen key.ppk -O private-openssh -o key.pem
```

```bash
# Convert to public key in pem format
puttygen key.ppk -O public-openssh -o key.pem.pub
```

</div>

<br>

---

### Add SSH Access to Target

<div>

```bash
cat id_rsa.pub
```

```bash
#Copy and Paste to Target
echo <id_rsa.pub> >> /home/<USER>/.ssh/authorized_keys
```

</div>

### SSH Connect

{{< tab set1 tab1 active >}}password{{< /tab >}}
{{< tab set1 tab2 >}}id_rsa{{< /tab >}}
{{< tab set1 tab3 >}}target shell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
ssh <USER>@<TARGET>
```

```bash
# After first connection (i.e., after 'yes' to fingerprint prompt)
sshpass -p <PASSWORD> ssh <USER>@<TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
ssh <USER>@<TARGET> -i id_rsa
```

```bash
# Fix: no matching host key type found. Their offer: ssh-rsa,ssh-dss
ssh <USER>@<TARGET> -i id_rsa -oHostKeyAlgorithms=+ssh-rsa
```

```bash
# Fix: sign_and_send_pubkey: no mutual signature supported 
ssh <USER>@<TARGET> -i id_rsa -o PubkeyAcceptedKeyTypes=ssh-rsa
```

</div>

<small>*Note: Always append a new line in id_rsa key*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Spawn target shell to escape restricted shell
ssh <USER>@<TARGET> -t bash
```

</div>

{{< /tabcontent >}}


<br>