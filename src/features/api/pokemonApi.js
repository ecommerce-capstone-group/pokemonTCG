import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Replace 'YOUR_API_KEY_HERE' with your actual API key from https://pokemontcg.io/
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.pokemontcg.io/v2/',
    prepareHeaders: (headers) => {
      headers.set('X-Api-Key', 'YOUR_API_KEY_HERE')
      return headers
    },
  }),
  endpoints: (builder) => ({
    getCards: builder.query({
      query: () => 'cards',
    }),
  }),
})

export const { useGetCardsQuery } = pokemonApi