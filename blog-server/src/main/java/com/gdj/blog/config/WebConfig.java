package com.gdj.blog.config;

import com.gdj.blog.interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 配置类
public class WebConfig implements WebMvcConfigurer {

    @Autowired
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

//    @Bean
//    @ConditionalOnMissingBean
//    public SAXReader saxReader() {
//        return new SAXReader();
//    }

}