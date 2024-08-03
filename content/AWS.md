---
title: "AWS"
date: 2024-7-21
tags: ["aws", "cloud", "s3"]
---

---
### Setup

```bash
# Install awscli
sudo apt install awscli
```

```bash
# Set config
aws configure
```

```
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: test
Default output format [None]:
```

### Default Credential Location

```bash
 ~/.aws/credentials
```

### S3

```bash
# List buckets
aws s3 --endpoint-url http://s3.example.com ls
```

```bash
# List bucket
aws s3 --endpoint-url http://s3.example.com ls s3://bucket_name
```

```bash
# Upload to bucket
aws s3 --endpoint-url http://s3.example.com cp test.txt s3://bucket_name/test.txt
```

### dynamodb

```bash
# List tables
aws --endpoint-url http://s3.example.com dynamodb list-tables
```

```bash
# Dump table
aws --endpoint-url http://s3.example.com dynamodb scan --table-name table_name
```

```bash
# Create table
aws --endpoint-url http://s3.example.com dynamodb create-table --table-name table_name --attribute-definitions AttributeName=title,AttributeType=S AttributeName=content,AttributeType=S --key-schema AttributeName=title,KeyType=HASH AttributeName=content,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5
```

```bash
# Add item to table
aws --endpoint-url http://s3.example.com dynamodb put-item --table-name table_name --item '{"title":{"S":"test"},"content":{"S":"test"}}'
```

### lambda

#### Basic

```bash
# List functions
aws lambda list-functions --endpoint-url http://s3.example.com
```

```bash
# Check a function
aws lambda get-function --function-name=function_name --endpoint-url=http://s3.example.com
```


#### Create a function (e.g. NodeJS)

```js
exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  return context.logStreamName
}
```

<br>

```bash
zip index.zip index.js
```

```bash
# Create a function test
aws lambda create-function --function-name test --zip-file fileb://index.zip --role arn:aws:iam::123456789012:role/lambda-role --endpoint-url http://s3.example.com --handler index.handler --runtime nodejs12.x
```

```bash
# Invoke function test
aws lambda invoke --function-name test --endpoint-url http://s3.example.com result.json
```

```bash
# Check result
cat result.json
```

<br>
