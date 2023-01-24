
package com.example;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

/**
 * The module containing all dependencies required by the {@link App}.
 */
public class DependencyFactory {

    private DependencyFactory() {}

    /**
     * @return an instance of DynamoDbClient
     */
    public static DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                       .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                       .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
                       .httpClientBuilder(UrlConnectionHttpClient.builder())
                       .build();
    }

    public static Gson gson() {
        return new GsonBuilder().create();
    }
}
