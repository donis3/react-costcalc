## Exchange Rate Fetching with Adapters

This app can support multiple remote exchange rate adapters. Here is how to add more

### Adding an Adapter

##### Step 1: Go to config.json

` "apiProviders": [ { "id": "unique_api_id", "name": "Exchange Rate Api Name", "requiresKey": true, "cacheDurationMinutes": 5, "url": "Full-Fetch-Url" } ],`

##### Step 2: Go to public/locales/{lang}/pages/currency.json

` "unique_api_id": { "name": "Localized Api Name", ...custom error codes may be added here }`

##### Step 3: Import fetch function in useExchangeRates

`
import myApiFetcher from './myApiFetcher';

    const fetchers = {
        api1: fetchExchangeRatesHost,
        api2: fetchTcmb,
        ...,
        myApiId: myApiFetcher
    };

`

##### Step 4: Create your fetcher

Fetcher function should throw error with custom error codes you defined in the localization file.
If success, must return an array of rate objects

example rate object:
`{code: 'USD', rate: 15.2}`

#### About Exchange Rate Pairs
Pairs are defined as BASE/QUOTE in most api's So when we request TRY rate using USD as base we get USD/TRY which is 16 at the time of this writing.

#### Fetcher Requirements
If the application's default currency is USD, app expects you to return X/USD. If your api is returning USD/X, you need to convert the value using 1/rate before sending data back to application.
