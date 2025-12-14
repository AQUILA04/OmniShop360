package com.omnishop360.backend.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
            .info(new Info()
                .title("OmniShop360 API")
                .version("1.0.0")
                .description("API RESTful pour la plateforme OmniShop360. Cette API permet de gérer toutes les opérations de la plateforme e-commerce multi-tenant.")
                .contact(new Contact()
                    .name("OmniShop360 Team")
                    .email("support@omnishop360.com"))
                .license(new License()
                    .name("Proprietary")
                    .url("https://omnishop360.com")))
            .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token obtenu depuis Keycloak. Format: Bearer {token}")));
    }
}

