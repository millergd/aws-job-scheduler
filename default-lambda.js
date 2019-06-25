/* eslint-disable */
const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const tableName = "aws-job-scheduler"

exports.handler = async (event, context, callback) => {

  try {
    console.log(event)
    console.log("Checking scheduled default jobs...")

    // Pull all emailJob cron jobs that have a date that is expired
    let totalJobs = []
    let lastEvalKey = true
    let firstTime = true
    while(lastEvalKey) {
      let params = {
        TableName: tableName,
        IndexName: "jobType-TTL-index",
        KeyConditionExpression: 'jobType = :j and #t < :d',
        ExpressionAttributeNames: {
          '#t': "TTL",
        },
        ExpressionAttributeValues: {
          ':d': Math.floor(new Date() / 1000),
          ':j': 'default'
        },
      };

      if( !firstTime && lastEvalKey) {
        params.ExclusiveStartKey = lastEvalKey
      }

      let result = await dynamodb.query(params).promise()
      //console.log(result)

      if( result.LastEvaluatedKey ) {
        lastEvalKey = result.LastEvaluatedKey
      } else {
        lastEvalKey = false
      }

      totalJobs = totalJobs.concat(result.Items)
      firstTime = false
    }

    console.log(totalJobs.toString())
    
    // Invoke the job's lambda function
    for(const job of totalJobs) {

      const invokeParams = {
        FunctionName: job.lambdaFuncArn,
        Payload: job.body // this should already be json-ified
      }

      await lambda.invoke(invokeParams).promise()
      
      const deleteParams = {
        TableName : "aws-job-scheduler",
        Key: {
          jobUUID: job.jobUUID,
        }
      };
      console.log("Deleting job. " + deleteParams.toString())

      await dynamodb.delete(deleteParams).promise()
    }

    console.log("Successfully checked scheduled jobs.")
    callback(null, "Successfully checked scheduled default jobs.");

  } catch (error) {
    console.log(error.message)
    callback(null, "Error checking scheduled default jobs." + error.message)
  }
}

