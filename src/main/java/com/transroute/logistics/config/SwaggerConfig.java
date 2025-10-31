package com.transroute.logistics.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TransRoute S.A. - Sistema de Logística Inteligente")
                        .description("Sistema completo de planificación de rutas y recursos implementando algoritmos avanzados")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo TransRoute")
                                .email("contacto@transroute.com")));
    }
}