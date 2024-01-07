package com.libraLink.springbootlibrary.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        // Disable cross site request forgery
        http.csrf().disable();

        // Protect endpoints at /api/<type>/secure
        http.authorizeRequests(configure -> configure
                .antMatchers("/api/books/secure/**")
                .authenticated())
                .oauth2ResourceServer()
                .jwt();

        // Add CORS filter
        http.cors();

        //  Add negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Force a non-empty repose body for 401 to make the response friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }

}
