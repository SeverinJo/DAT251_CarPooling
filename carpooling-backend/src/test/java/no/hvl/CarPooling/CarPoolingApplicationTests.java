package no.hvl.CarPooling;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class CarPoolingApplicationTests {

	@Test
	void contextWithTestContainersLoads() {
		// no exception thrown if application context and testcontainers loads correctly
	}

}
