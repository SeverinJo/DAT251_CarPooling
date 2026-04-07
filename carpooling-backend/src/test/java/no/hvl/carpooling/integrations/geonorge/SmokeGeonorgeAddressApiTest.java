package no.hvl.carpooling.integrations.geonorge;

import no.hvl.carpooling.TestcontainersConfiguration;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
public class SmokeGeonorgeAddressApiTest {

    @Autowired
    private GeonorgeAddressApi geonorgeAddressApi;

    @Test
    void smoke() {
        var query = "Inndalsveien 28 Bergen";
        var searchResult = Assertions.assertDoesNotThrow(() -> geonorgeAddressApi.search(query));
        Assertions.assertFalse(searchResult.addresses().isEmpty());
        System.out.println(searchResult);
    }

}
