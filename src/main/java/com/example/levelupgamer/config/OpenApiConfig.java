package com.example.levelupgamer.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI levelupGamerOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("LevelUpGamer API")
                        .description("API REST para Level Up Gamer: gestión de productos, categorías y carrito")
                        .version("v1.0.0")
                        .contact(new Contact().name("LevelUpGamer Dev").email("dev@example.com"))
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Repositorio")
                        .url("https://example.com/repo"));
    }

}
