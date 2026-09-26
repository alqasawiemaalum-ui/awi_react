import './App.css'
import { useEffect, useState } from 'react'

function App(){
  const [value, setValue] = useState(null)
  const [pokemon, setPokemon] = useState('')
  const [pokemonList, setPokemonList] = useState([])

  useEffect(() => {
    async function loadPokemonList() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        const data = await response.json()
        setPokemonList(data.results)
      } catch (error) {
        console.error('Failed to load Pokémon list:', error)
      }
    }

    loadPokemonList()
  }, [])

  async function fetchPokemonDetails(nameOrId) {
    const trimmedPokemon = String(nameOrId).trim()
    if (!trimmedPokemon) return

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(trimmedPokemon)}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Pokemon not found')
      }

      const data = await response.json()
      setValue(data)
    } catch (error) {
      console.error(error)
      setValue(null)
    }
  }

  async function handleButton() {
    await fetchPokemonDetails(pokemon)
  }

  function handleInputChange(event) {
    setPokemon(event.target.value)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleButton()
    }
  }

  function handlePokemonSelect(name) {
    setPokemon(name)
    fetchPokemonDetails(name)
  }

  return (
    <div className='pokemon-app'>
      <div className='pokemon-panel'>
        <div className='panel-header'>
          <span className='badge'>Pokédex</span>
          <h1>Search your Pokémon</h1>
        </div>

        <div className='search-box'>
          <input
            type='text'
            value={pokemon}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Enter a Pokémon name or ID'
            aria-label='Pokemon name or ID'
          />
          <button onClick={handleButton}>Fetch</button>
        </div>

        <div className='pokemon-card'>
          {value ? (
            <>
              <div className='image-wrap'>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${value.id}.png`}
                  alt={value.name}
                />
              </div>

              <div className='pokemon-info'>
                <p className='pokemon-name'>{value.name}</p>

                <div className='meta-row'>
                  <span className='meta-pill'># {value.id}</span>
                </div>

                <div className='detail-grid'>
                  <div className='detail-card'>
                    <span>Type</span>
                    <strong>{value.types?.map((item) => item.type.name).join(', ') || 'Unknown'}</strong>
                  </div>
                  <div className='detail-card'>
                    <span>Health</span>
                    <strong>{value.stats?.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 0}</strong>
                  </div>
                  <div className='detail-card'>
                    <span>Attack</span>
                    <strong>{value.stats?.find((stat) => stat.stat.name === 'attack')?.base_stat ?? 0}</strong>
                  </div>
                  <div className='detail-card'>
                    <span>Defense</span>
                    <strong>{value.stats?.find((stat) => stat.stat.name === 'defense')?.base_stat ?? 0}</strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='empty-state'>
              <p>Choose a Pokémon to reveal its details.</p>
            </div>
          )}
        </div>

        <div className='pokemon-list-section'>
          <h2>All Pokémon</h2>
          <div className='pokemon-list'>
            {pokemonList.map((item) => {
              const pokemonId = Number(item.url.split('/').filter(Boolean).pop())

              return (
                <button
                  key={item.name}
                  className='pokemon-item'
                  onClick={() => handlePokemonSelect(item.name)}
                  type='button'
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App