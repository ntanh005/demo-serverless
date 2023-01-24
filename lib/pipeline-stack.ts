import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
 
import { Construct } from "constructs";
import { DeploymentStage } from "./deploy-stage";

export class PipeLineStack extends Stack {
    constructor(scope?: Construct, id?: string, props?: StackProps) {
        super(scope, id, props);

        const envType = this.node.tryGetContext("environmentType") || "qa";
        const ctx =this.node.tryGetContext(envType);
        console.log("ctx", ctx);

        const sourceStage = CodePipelineSource.connection(ctx.repository.name, ctx.repository.branch, {
            connectionArn: "arn:aws:codestar-connections:ap-northeast-1:210133173206:connection/b41bb400-1f91-4c13-bc2e-b0b009a745ac"
        });
        const synth = new ShellStep("Synth", {
            env: {
                "ENV_TYPE" : envType
            },
            input: sourceStage,
            installCommands: [
                "npm install -g aws-cdk",
                "mvn clean package"
            ],
            commands: [
                "cdk synth -c environmentType=$ENV_TYPE"
            ]
            // primaryOutputDirectory: "lambda/ntanh"
        });
        const pipeLine = new CodePipeline(this, "PipeLine", {
            pipelineName: ctx.pipeline.name,
            synth: synth,
            crossAccountKeys: true,
            dockerEnabledForSynth: true
        });

        pipeLine.addStage(new DeploymentStage(this, "QA", 'qa'));
    }
}