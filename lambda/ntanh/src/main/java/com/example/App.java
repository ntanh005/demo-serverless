package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

/**
 * Lambda function entry point. You can change to use other pojo type or implement
 * a different RequestHandler.
 *
 * @see <a href=https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html>Lambda Java Handler</a> for more information
 */
public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private final DynamoDbClient dynamoDbClient;
    private final Gson gson;

    public App() {
        // Initialize the SDK client outside of the handler method so that it can be reused for subsequent invocations.
        // It is initialized when the class is loaded.
        dynamoDbClient = DependencyFactory.dynamoDbClient();
        gson = DependencyFactory.gson();
        // Consider invoking a simple api here to pre-warm up the application, eg: dynamodb#listTables
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent  input, final Context context) {
        context.getLogger().log("V3");
        context.getLogger().log(gson.toJson(input));

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withBody("OK");

        // throw new RuntimeException("Test");
        return response;
    }
}


