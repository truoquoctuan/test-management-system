package com.bigbird.tmsrepo.cmmn.config;//package com.tmsbe.tms_repo.tms_repo.cmmn.config;
//
//import org.springframework.cache.CacheManager;
//import org.springframework.cache.annotation.CachingConfigurationSelector;
//import org.springframework.context.annotation.Bean;
//import org.springframework.data.redis.cache.RedisCacheConfiguration;
//import org.springframework.data.redis.cache.RedisCacheManager;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//
//import java.time.Duration;
//
//public class CacheConfig extends CachingConfigurationSelector {
//    @Bean
//    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
//        return RedisCacheManager
//                .builder(redisConnectionFactory)
//                .cacheDefaults(defaultCacheConfiguration())
//                .build();
//    }
//
//    private RedisCacheConfiguration defaultCacheConfiguration() {
//        return RedisCacheConfiguration.defaultCacheConfig()
//                .entryTtl(Duration.ofMinutes(10))  // TTL for cache
//                .disableCachingNullValues();  // Do not cache null values
//    }
//}
