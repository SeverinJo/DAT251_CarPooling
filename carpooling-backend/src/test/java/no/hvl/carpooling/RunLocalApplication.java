package no.hvl.carpooling;

import org.springframework.boot.SpringApplication;

public class RunLocalApplication {

    public static void main(String[] args) {
        SpringApplication.from(CarPoolingApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
