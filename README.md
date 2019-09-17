# AWS Job Schedules

This is a universal job scheduler for AWS lambda functions. The underlying architecture is a timed lambda function(s) that regularly check a dynamodb table for jobs that have expired TTL timestamps, and then execute the lambda function for that job.

## Deployment

Clone this repository and run the following command on a console with AWS permissions.
```bash
make test
```

Note: you must have the AWS cli installed on your machine and configured with credentials

## Requirements
Your resource stack will create a timed lambda function that executes jobs (e.g. other lambda functions) that are in a DynamoDB table which is also created automatically as part of the resource stack. It is up to you to add jobs to the table however you see fit. Items in the job table must be entered in the following form:
```json
{   
    "lambdaFuncArn": "STRING",
    "TTL": "INT",
    "body": "STRING",
    "jobUUID": "STRING",
    "jobType": "STRING"
}
```

`lambdaFuncArn`: This is the ARN of the lambda function that you want to execute.
`body`: (optional) This is a JSON object that is valid input for the corresponding lambda function.
`TTL`: This is the time that the job needs to be executed.
`jobUUID`: This doesn't technically have to be a UUID, but we recommed UUID because this is the hashKey of the item.
`jobType`: This is the sort key of the item. You may enter "default" for now, but the future plan is to have various types of jobs that can be executed differently.

## Customizations

You may futher customize this stack to fit your exact needs.

### Trigger Frequency

TBD

### Multiple Job Types

TBD
