# V1 API

## Error handling

- For data that only returns one result, make sure that the data is retrieved successfully by using `!!`.
- For data that needs id casting, use try catch for clearer error message.
- For data that returns multiple results, no need to check.
- Uncaught error is handled in [ExpressErrorHandler.ts](../../utils/ExpressErrorHandler.ts)
