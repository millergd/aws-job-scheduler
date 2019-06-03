# AWS Job Schedules

This is a universal job scheduler for AWS lambda functions. The underlying architecture is a timed lambda function(s) that regularly check a dynamodb table for jobs that have expired TTL timestamps, and then execute the lambda function for that job.

## Deployment

You can deploy this stack in one of two ways:

Click here OR clone this repository and run the following command on a console with AWS permissions.
```bash
make test
```

## Requirements
Items in the job table must be entered in the following form:
```json
{
    "jobUUID": "STRING",
    "jobType": "STRING",
    "TTL": "INT",
    "lambdaFuncArn": "STRING",
    "body": "STRING"
}
```

The `body` parameter is optional and must be a JSON object.

## Customizations

You may futher customize this stack to fit your exact needs.

### Trigger Frequency

### Multiple Job Types