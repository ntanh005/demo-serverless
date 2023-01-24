import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ServerlessStack } from "./serverless-stack";

export class DeploymentStage  extends Stage {
   constructor(scope: Construct, id: string, environmentType: string, props?: StageProps) {
        super(scope, id, props);
        this.node.setContext("environmentType", environmentType);
        
        const ctx = this.node.tryGetContext(environmentType);
        const stackName = this.node.tryGetContext("prefix");
        const stack = new ServerlessStack(this, stackName, {
            env: {
                account: ctx.account,
                region: ctx.region
            }
        });
   }
}