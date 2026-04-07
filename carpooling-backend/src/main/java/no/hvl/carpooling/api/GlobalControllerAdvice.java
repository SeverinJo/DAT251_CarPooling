package no.hvl.carpooling.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalControllerAdvice {

    private static Logger logger = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    // todo: error handling here

    // todo: give 400 on ValidationExceptions
    // todo: give 404 on NotFoundExceptions
    // todo: give 500 on unknown exceptions

}
