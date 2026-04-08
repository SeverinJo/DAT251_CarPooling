package no.hvl.carpooling.integrations.geonorge;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean(name = "geonorgeRestTemplate")
    public RestTemplate geonorgeRestTemplate() {
        return new RestTemplate();
    }

}
