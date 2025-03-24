import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [data, setData] = useState([])
  const [counties, setCounties] = useState([])
  const [county, setCounty] = useState([])
  const [education, setEducation] = useState([])
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
        const jsonData = await response.json()
        setData(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
 

  return (
    <>
      <div className='app-div'>
        <header>
          <p>This is in implementation of Choropleth of US Education Attainment</p>
        </header>
        <div className='test-data'>
          <p>Test Data</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        
      </div>
    </>
  )
}

export default App
