import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Stack, Fn } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, FunctionRuntime } from 'aws-cdk-lib/aws-appsync';

const backend = defineBackend({
  auth,
  data,
});

const dataStack = Stack.of(backend.data);

// get the stack region
const region = 'us-east-1';

// create an RDS database stack
// const dbStack = backend.createStack("databaseStack");
const secret = rds.DatabaseSecret.fromSecretCompleteArn(dataStack, 'secret', 'arn:aws:secretsmanager:us-east-1:332009426877:secret:SimSearchSecret6198DC4C-cILu10MtS7Ha-amAvaB');
const cluster = rds.ServerlessCluster.fromServerlessClusterAttributes(dataStack, 'cluster', { clusterIdentifier: 'rdsstack-simsearchcluster349c3e3c-hln0ssagpv1c', secret });
const rdsDs = backend.data.addRdsDataSource('rds', cluster, secret, 'postgres', { name: 'productInfo' })
cluster.grantDataApiAccess(rdsDs);

// set up bedrock
// const EMBED_MODEL_ID = 'amazon.titan-embed-text-v2:0';
const EMBED_MODEL_ID = 'amazon.titan-embed-text-v1';
const MODEL_ID = 'anthropic.claude-3-sonnet-20240229-v1:0';
const bedrockDataSource = backend.data.addHttpDataSource('BedrockDataSource', `https://bedrock-runtime.${region}.amazonaws.com`, {
  authorizationConfig: { signingRegion: dataStack.region, signingServiceName: 'bedrock' },
});


bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],
    resources: [`arn:aws:bedrock:${dataStack.region}::foundation-model/${MODEL_ID}`],
  }),
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],
    resources: [`arn:aws:bedrock:${dataStack.region}::foundation-model/${EMBED_MODEL_ID}`],
  }),
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = { MODEL_ID, EMBED_MODEL_ID };
backend.data.addResolver('search', {
  typeName: 'Query',
  fieldName: 'search',
  runtime: FunctionRuntime.JS_1_0_0,
  code: Code.fromInline(/*javascript*/ `
    export const request = (ctx) => {}
    export const response = (ctx) => ctx.prev.result
  `),
  pipelineConfig: [
    backend.data.addFunction('embedding', {
      name: 'embeddingFn',
      dataSource: bedrockDataSource,
      code: Code.fromAsset('amplify/data/getEmbedding.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    }),
    backend.data.addFunction('search', {
      name: 'searchFn',
      dataSource: rdsDs,
      code: Code.fromAsset('amplify/data/search.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    }),
  ],
});


