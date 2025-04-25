package com.tms_file.cmmn.config;

import graphql.GraphQL;
import graphql.kickstart.tools.SchemaParser;
import graphql.scalars.ExtendedScalars;
import graphql.schema.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

@Configuration
public class GraphQLConfig {

//    @Bean
//    public MultipartResolver multipartResolver() {
//        return new StandardServletMultipartResolver();
//    }

    @Bean
    public GraphQLScalarType uploadScalar() {
        return GraphQLScalarType.newScalar()
                .name("Upload")
                .description("A file upload scalar")
                .coercing(new Coercing<MultipartFile, MultipartFile>() {
                    @Override
                    public MultipartFile serialize(Object dataFetcherResult) throws CoercingSerializeException {
                        if (dataFetcherResult instanceof MultipartFile) {
                            return (MultipartFile) dataFetcherResult;
                        }
                        throw new CoercingSerializeException("Expected a MultipartFile object.");
                    }

                    @Override
                    public MultipartFile parseValue(Object input) throws CoercingParseValueException {
                        if (input instanceof MultipartFile) {
                            return (MultipartFile) input;
                        }
                        throw new CoercingParseValueException("Expected a MultipartFile object.");
                    }

                    @Override
                    public MultipartFile parseLiteral(Object input) throws CoercingParseLiteralException {
                        throw new CoercingParseLiteralException("Parsing literal of 'Upload' scalar is not supported.");
                    }
                })
                .build();
    }

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer(GraphQLScalarType uploadScalar) {
        return wiringBuilder -> wiringBuilder.scalar(uploadScalar);
    }
}
