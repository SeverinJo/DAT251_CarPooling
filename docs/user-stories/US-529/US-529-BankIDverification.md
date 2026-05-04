# US-529 BankID verification [initial example ig]

## Story
As a person who has never tried carpooling, I want drivers to be verified through BankID, in 
order for it to feel safe to test out.

## Acceptance criteria
Make it required to verify new accounts through BankID, either during account creation or first 
posting as a driver.

## Implementation strategy
 - [ Unrealistic ] Set up an OpenID Connect client and register it with BankID. Set authorization endpoints as a redirect during completion in /signup.
 - [ Realistic ] Just use a mock page as "BankID" authorization and redirect to that one instead.

## BFTB Score
Bang: 8
Buck: 13
TOTAL: 0.62

## misc