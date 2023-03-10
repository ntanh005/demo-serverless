#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessStack } from '../lib/serverless-stack';

const app = new cdk.App();
const environmentType = app.node.tryGetContext("environmentType") || 'qa'
app.node.setContext("environmentType", environmentType);
console.log(environmentType)
const environmentContext = app.node.tryGetContext(environmentType);
const region = environmentContext["region"];
const account = app.node.tryGetContext("account");
const stack_name = `${app.node.tryGetContext("prefix")}-${environmentType}`;


new ServerlessStack(app, stack_name, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: account, region: region }

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});