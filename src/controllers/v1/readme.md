# V1 API

## Error handling

- For data that only returns one result, make sure that the data is retrieved successfully by using `!!`.
- For data that needs id casting, use try catch for clearer error message.
- For data that returns multiple results, no need to check.
- Uncaught error is handled in [ExpressErrorHandler.ts](../../utils/ExpressErrorHandler.ts)

## Status code

https://www.rfc-editor.org/rfc/rfc4918#section-11.2

- 200: Success
- 201: Created
- 400: Bad request -> Invalid input
- 422: Unprocessable entity -> [Data not found](https://stackoverflow.com/questions/40439663/correct-http-error-code-if-id-passed-in-body-not-exists-invalid)
- 500: Internal server error -> Unexpected error
