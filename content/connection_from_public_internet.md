---
title: "Connection from Public Internet"
date: 2024-6-26
tags: ["Web Exploitation", "Http File Transfer", "Remote File Inclusion", "XSS", "File Transfer", "Public Ip", "Ngrok", "Serveo", "Webhook", "XXE"]
---

### Simply catch HTTP request

[webhook.site](https://webhook.site)

---

### Catch HTTP request and host a web server 

{{< tab set1 tab1 active >}}serveo.net{{< /tab >}}
{{< tab set1 tab2 >}}ngrok{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Start a local HTTP server
python3 -m http.server <LOCAL_PORT>
```

```console {class="sample-code"}
$ python3 -m http.server 3000 
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

```console
# Redirect http request to localhost:<LOCAL_PORT>
ssh -R 80:localhost:<LOCAL_PORT> serveo.net
```

```console {class="sample-code"}
$ ssh -R 80:localhost:3000 serveo.net
Forwarding HTTP traffic from https://7ddf32e17a6ac5ce04a8ecbf782ca509.serveo.net
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
ngrok http 80
```

<small>*Ref: [ngrok](https://ngrok.com)*</small>
<br>
<small>*Note: ngrok free will show a warning message and require user accpet to proceed*</small>
<br>
<small>*Note: Not good for XSS*</small>

{{< /tabcontent >}}
