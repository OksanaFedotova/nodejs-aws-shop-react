import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3, aws_s3_deployment as s3deploy } from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, "BucketAwsShopReact", {
      versioned: true,
      bucketName: "cdk-aws-oksana",
      websiteIndexDocument: "index.html",
    });
    new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
    });
  }
}
