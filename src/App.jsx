import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

import './App.css'

function App() {
  const [data, setData] = useState([])
  const [counties, setCounties] = useState([])
  const [county, setCounty] = useState([])
  const [education, setEducation] = useState([])
  
  //fetch all data when DOM is rendered
  useEffect(() => {
    //fetch US education data
    const fetchData = async () => {
      try {
        const response = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
        const jsonData = await response.json()
        setData(jsonData)
      } catch (error) {
        console.error('Error fetching US Education data:', error)
      }
    }

    //fetch US counties data
    const fetchCounties = async () => {
      try {
        const responseCounties = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
        const jsonDataCounties = await responseCounties.json()
        setCounties(jsonDataCounties)
      } catch (error) {
        console.error('Error fetching US County data:', error)
      }
      }

    fetchData()
    fetchCounties()
  }, [])

  const svgRef = useRef()
  //Render the US map every time data is fetched
  useEffect(() => {
    const width = 800
    const height = 600
    const padding = 50

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
    
    //clear all previous svg
    svg.selectAll('*').remove()




    
  }, [data, counties])
 

  return (
    <>
      <div className='app-div'>
        <header>
          <p>This is in implementation of Choropleth of US Education Attainment</p>
        </header>
       
       
       
       
       
        <div className='test-data'>
          <p>Test Data</p>
          <div className='us-education-data'>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <pre>{JSON.stringify(counties, null, 2)}</pre>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default App
