package no.hvl.carpooling.exceptions;

/**
 * Domain validation error that should result in a 400 response via {@link no.hvl.carpooling.api.GlobalControllerAdvice}.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

}
