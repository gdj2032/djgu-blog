package com.gdj.blog.config;

import com.gdj.blog.interceptor.LoginInterceptor;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration // 配置类
public class WebConfig implements WebMvcConfigurer {

    @Resource
    private LoginInterceptor loginInterceptor;

    // 忽略检查token
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor).addPathPatterns("/**")
                .excludePathPatterns("/login")
                .excludePathPatterns("/route/list")
                .excludePathPatterns("/tag/list")
                .excludePathPatterns("/itemData/getInitTable")
                .excludePathPatterns("/file/download")
                .excludePathPatterns("/tools/data2Interface");
    }

    @Resource
    Environment env;

    public Boolean isDev() {
        return Arrays.asList(env.getActiveProfiles()).contains("dev");
    }

    public Boolean isProd() {
        return Arrays.asList(env.getActiveProfiles()).contains("prod");
    }

//    @Bean
//    @ConditionalOnMissingBean
//    public SAXReader saxReader() {
//        return new SAXReader();
//    }

}