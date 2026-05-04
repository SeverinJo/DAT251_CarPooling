package no.hvl.carpooling.api;

import no.hvl.carpooling.exceptions.ValidationException;
import no.hvl.carpooling.integrations.geonorge.GeonorgeNotAvailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalControllerAdvice {

    private static Logger logger = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        logger.info("Validation failed: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(new ErrorResponse(400, ex.getMessage()));
    }

    @ExceptionHandler(GeonorgeNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(GeonorgeNotAvailableException ex) {
        logger.info("Resource not available: {}", ex.getMessage(), ex);
        return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex) {
        logger.error("Internal server error");
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal server error"));
    }

}
