---
title: "AWS"
date: 2024-7-21
tags: ["aws", "cloud", "s3"]
---

### Setup

<div>

```console
# Install awscli
sudo apt install awscli
```

```console
# Set config
aws configure
```

```
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: test
Default output format [None]:
```

</div>

### Default AWS Credential Location

<div>

```console
~/.aws/credentials
```

</div>

<br>

---

### AWS Services

{{< tab set1 tab1 active >}}S3{{< /tab >}}
{{< tab set1 tab2 >}}dynamodb{{< /tab >}}
{{< tab set1 tab3 >}}lambda{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# List buckets
aws s3 --endpoint-url <TARGET> ls
```

```console
# List bucket
aws s3 --endpoint-url <TARGET> ls s3://<BUCKET_NAME>
```

```console
# Upload to bucket
aws s3 --endpoint-url <TARGET> cp <FILE> s3://<BUCKET_NAME>/<FILE>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# List tables
aws --endpoint-url <TARGET> dynamodb list-tables
```

```console
# Dump table
aws --endpoint-url <TARGET> dynamodb scan --table-name <TABLE_NAME>
```

```console
# Create table (e.g. with column 'title' and 'content')
aws --endpoint-url <TARGET> dynamodb create-table --table-name <TABLE_NAME> --attribute-definitions AttributeName=title,AttributeType=S AttributeName=content,AttributeType=S --key-schema AttributeName=title,KeyType=HASH AttributeName=content,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5
```

```console
# Add item to table (e.g. with column 'title' and 'content')
aws --endpoint-url <TARGET> dynamodb put-item --table-name <TABLE_NAME> --item '{"title":{"S":"<TITLE>"},"content":{"S":"<CONTENT>"}}'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Basic

<div>

```console
# List functions
aws lambda list-functions --endpoint-url <TARGET>
```

```console
# Check a function
aws lambda get-function --function-name=<FUNC_NAME> --endpoint-url <TARGET>
```

</div>

#### Create a function (e.g. NodeJS)

<div>

```console
exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  return context.logStreamName
}
```

<br>

```console
zip index.zip index.js
```

```console
# Create a function
aws lambda create-function --function-name <FUNC_NAME> --zip-file fileb://index.zip --role arn:aws:iam::123456789012:role/lambda-role --endpoint-url <TARGET> --handler index.handler --runtime nodejs12.x
```

```console
# Invoke function test
aws lambda invoke --function-name <FUNC_NAME> --endpoint-url <TARGET> result.json
```

```console
# Check result
cat result.json
```

</div>

{{< /tabcontent >}}

<br>
