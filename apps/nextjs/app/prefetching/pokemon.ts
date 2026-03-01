import { isServer, queryOptions } from '@tanstack/react-query'

export const pokemonOptions = queryOptions({
  queryKey: ['pokemon'],
  queryFn: async () => {
    console.log('Fetching pokemon data...', isServer)
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/25')

    return response.json()
  },
})