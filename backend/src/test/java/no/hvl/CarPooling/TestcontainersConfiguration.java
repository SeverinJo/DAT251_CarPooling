package no.hvl.CarPooling;

import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    private final Logger logger = LoggerFactory.getLogger(TestcontainersConfiguration.class);

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() throws InterruptedException {
        var container = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));
        container = container.withDatabaseName("testdb");
        container = container.withUsername("test");
        container = container.withPassword("test");

        container = container.withCreateContainerCmdModifier(cmd -> cmd.withHostConfig(
                Objects.requireNonNull(cmd.getHostConfig()).withPortBindings(new PortBinding(
                        Ports.Binding.bindPort(32780), new ExposedPort(5432)
                ))
        ));

        container.start();

        // wait until container has started
        Thread.sleep(2000);

        System.setProperty("spring.datasource.url", container.getJdbcUrl());
        System.setProperty("spring.flyway.url", container.getJdbcUrl());
        System.setProperty("spring.flyway.user", container.getUsername());
        System.setProperty("spring.flyway.password", container.getPassword());

        return container;
    }

    @Bean
    public ApplicationRunner loadTestData(JdbcTemplate jdbcTemplate) {
        return args -> {
            Path sqlPath = new ClassPathResource("db/data/testdata_at_startup.sql").getFile().toPath();
            String sql = Files.readString(sqlPath);
            jdbcTemplate.execute(sql);
            logger.info("Database initialized with testdata_at_startup.sql ✅");
        };
    }
}
