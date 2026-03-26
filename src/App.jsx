import React, { useState, useEffect } from 'react'
import { useGetCardsQuery } from './features/api/pokemonApi'

function App() {
  const { data, error, isLoading } = useGetCardsQuery()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCard, setSelectedCard] = useState(null)
  const [darkMode, setDarkMode] = useState(false) // <-- Dark mode

  const cardsPerPage = 20

 
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '20px',
          padding: '20px'
        }}
      >
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              style={{
                height: '220px',
                backgroundColor: darkMode ? '#333' : '#e0e0e0',
                borderRadius: '16px',
                animation: 'pulse 1.5s infinite'
              }}
            ></div>
          ))}
      </div>
    )
  }

  if (error) return <h1 style={{ textAlign: 'center' }}>Error loading cards</h1>
  if (!data?.data?.length) return <h1 style={{ textAlign: 'center' }}>No cards found</h1>

  // Filter cards
  let filteredCards = data.data.filter(
    (card) =>
      card.name.toLowerCase().includes(search.toLowerCase()) &&
      (!typeFilter || card.types?.includes(typeFilter))
  )

  // Sort cards
  if (sortOption === 'name') {
    filteredCards.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption === 'hp') {
    filteredCards.sort((a, b) => (parseInt(b.hp) || 0) - (parseInt(a.hp) || 0))
  }

  // Pagination
  const displayedCards = filteredCards.slice(0, page * cardsPerPage)

  // Type colors
  const typeColors = {
    Fire: '#FF7043',
    Water: '#42A5F5',
    Grass: '#66BB6A',
    Lightning: '#FFEE58',
    Psychic: '#AB47BC',
    Fighting: '#8D6E63',
    Darkness: '#546E7A',
    Metal: '#B0BEC5',
    Fairy: '#F48FB1',
    Dragon: '#5C6BC0',
    Colorless: '#ECEFF1'
  }

  const bgGradient = darkMode
    ? 'linear-gradient(to bottom, #1e1e2f, #2b2b3f)'
    : 'linear-gradient(to bottom, #f0f4f8, #c8e6f5)'

  const textColor = darkMode ? '#fff' : '#000'

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        background: bgGradient,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: textColor,
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      {/* Dark mode toggle */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: darkMode
              ? 'linear-gradient(90deg, #FF3E3E, #FF8C42)'
              : 'linear-gradient(90deg, #555, #888)',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            marginBottom: '10px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1
        style={{
          textAlign: 'center',
          color: '#FF3E3E',
          marginBottom: '25px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        Pokémon Card Explorer
      </h1>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '25px'
        }}
      >
        <input
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            width: '220px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            fontSize: '16px',
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
            transition: 'background 0.3s, color 0.3s'
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            fontSize: '16px',
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          <option value="">All Types</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            fontSize: '16px',
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="hp">HP</option>
        </select>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px'
        }}
      >
        {displayedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              background: darkMode ? '#2b2b3f' : '#fff',
              boxShadow: darkMode
                ? '0 6px 12px rgba(0,0,0,0.5)'
                : '0 6px 12px rgba(0,0,0,0.15)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = darkMode
                ? '0 10px 20px rgba(0,0,0,0.7)'
                : '0 10px 20px rgba(0,0,0,0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = darkMode
                ? '0 6px 12px rgba(0,0,0,0.5)'
                : '0 6px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div
              style={{
                height: '180px',
                background: `linear-gradient(180deg, ${
                  typeColors[card.types?.[0]] || '#eee'
                } 0%, ${darkMode ? '#2b2b3f' : '#ffffff'} 100%)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={card.images.small}
                alt={card.name}
                style={{ maxHeight: '140px', borderRadius: '12px' }}
              />
            </div>
            <p
              style={{
                fontWeight: 'bold',
                padding: '10px 0',
                fontSize: '16px',
                color: darkMode ? '#fff' : '#000'
              }}
            >
              {card.name}
            </p>
          </div>
        ))}
      </div>

      {/* Load more */}
      {page * cardsPerPage < filteredCards.length && (
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button
            onClick={() => setPage(page + 1)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(90deg, #FF3E3E, #FF8C42)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: darkMode ? '#2b2b3f' : '#fff',
              borderRadius: '20px',
              padding: '25px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: darkMode
                ? '0 10px 25px rgba(0,0,0,0.7)'
                : '0 10px 25px rgba(0,0,0,0.3)',
              color: darkMode ? '#fff' : '#000',
              transition: 'background 0.3s, color 0.3s'
            }}
          >
            <img
              src={selectedCard.images.large}
              alt={selectedCard.name}
              style={{
                borderRadius: '16px',
                marginBottom: '15px',
                maxHeight: '300px'
              }}
            />
            <h2 style={{ marginBottom: '10px', color: '#FF3E3E' }}>{selectedCard.name}</h2>
            <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>HP: {selectedCard.hp}</p>
            <p style={{ marginBottom: '15px' }}>
              Type: {selectedCard.types?.join(', ') || 'Unknown'}
            </p>
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(90deg, #FF3E3E, #FF8C42)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Simple pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}

export default App