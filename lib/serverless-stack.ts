import * as cdk from 'aws-cdk-lib';
import { BundlingOutput, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { LambdaDeploymentConfig, LambdaDeploymentGroup } from 'aws-cdk-lib/aws-codedeploy';
import { Alias, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const environmentType = this.node.tryGetContext('environmentType');
    const context = this.node.tryGetContext(environmentType);
    const aliasName = context.lambda.alias;
    const stageName = context.lambda.stage;
    const functionName = context.lambda.functionName;
    const currentDate = new Date();


    const javaFunc = new Function(this, "JavaLambda", {
      runtime: Runtime.JAVA_11,
      functionName: functionName,
      currentVersionOptions: {
        description: `version deployed on on ${currentDate}`,
        removalPolicy: RemovalPolicy.RETAIN
      },
      code: Code.fromAsset("lambda/ntanh/", {
        bundling: {
           image: Runtime.JAVA_11.bundlingImage,
           outputType: BundlingOutput.ARCHIVED,
           user: "root",
           volumes: [{
            hostPath: process.env['HOME'] + "/.m2/",
            containerPath: "/root/.m2/"
           }],
           command: [
              "/bin/sh",
              "-c",
              "pwd && mvn clean install && ls target && cp target/ntanh.jar /asset-output/",
            ]
        }
      }),
      handler: "com.example.App"
    });

    const newVersion = javaFunc.currentVersion;
    newVersion.applyRemovalPolicy(RemovalPolicy.RETAIN);
    
    const alias = new Alias(this, "FunctionAlias", {
      version: newVersion,
      aliasName: aliasName
    });

    new LambdaRestApi(this, "RestAPI", {
      handler: alias,
      deployOptions: {
        stageName: stageName
      }
    }); 

    const failAlarm = new Alarm(this, "FunctionFailureAlarm", {
      metric: alias.metricErrors(),
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription: "The latest deployment errors > 0",
      alarmName: "canary alarm",
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD
    });

    new LambdaDeploymentGroup(this, "CanaryDeployment", {
      alias: alias,
      deploymentConfig: LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      alarms: [failAlarm]
    });
    
  }
}
