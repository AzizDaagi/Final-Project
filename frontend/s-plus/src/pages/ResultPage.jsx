import React, { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import "../styles/resultPage.css"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function SearchPage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    useEffect(() => {
      const savedResults = localStorage.getItem("searchResults");
      if (savedResults) {
        setSearch(JSON.parse(savedResults));
      }
    }, []);
    

    const handleButtonClick = (id) => {
      navigate(`/property/${id}`)
    };

    const handleSearch = () => {
      navigate("/home")
    }
    
  return (
    <div className="page">
      <Navbar/>
      <div className="property-list">
        <h1>Results</h1>
        <button onClick={handleSearch}>Search 🔎</button>
        <div className="card-container">
          {search.length > 0 ? (
            search.map((property) => (
              <Card
                key={property._id}
                image={property.images[0]}
                title={property.title}
                price={parseInt(property.pricePerNight)}
                onButtonClick={() => handleButtonClick(property._id)}
              />
            ))
          ) : (
            <p>No properties found</p>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default SearchPage
