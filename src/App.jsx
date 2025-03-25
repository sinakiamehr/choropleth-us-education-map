import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson'

import './App.css'

function App() {
  const [data, setData] = useState([])
  const [counties, setCounties] = useState([])
  
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

  //useRef hook to store the svg element
  const svgRef = useRef()
  //Render the US map every time data is fetched
  useEffect(() => {
    if (data.length === 0 || counties.length === 0) {
      return
    }
    //clear the previous svg
    d3.select(svgRef.current).selectAll('*').remove()

    //set dimensions for the svg and padding
    const width = 800
    const height = 600
    const padding = 50

    //initialize svg element
    const svg = d3.select(svgRef.current)
    .attr('width', width)
    .attr('height', height)

    //add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', padding / 2)
      .attr('text-anchor', 'middle')
      .attr("id", "title")
      .attr('fill', 'white')
     .text('United States Educational Attainment')

    //add description
    svg.append('text')
     .attr('x', width / 2)
     .attr('y', padding / 2 + 20)
     .attr('text-anchor','middle')
     .attr("id", "description")
     .attr('fill', 'white')
    .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)')

    // Create color scale
    const minEducation = d3.min(data, d => d.bachelorsOrHigher)
    const maxEducation = d3.max(data, d => d.bachelorsOrHigher)
    const colorScale = d3.scaleThreshold()
      .domain(d3.range(minEducation, maxEducation, (maxEducation - minEducation) / 8))
      .range(d3.schemeGreens[9])

    // Create path generator
    const path = d3.geoPath()

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      

    // Draw counties
    svg.append('g')
      .selectAll('path')
      .data(topojson.feature(counties, counties.objects.counties).features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
      .attr('data-fips', d => d.id)
      .attr('data-education', d => {
        const result = data.find(item => item.fips === d.id)
        return result ? result.bachelorsOrHigher : 0
      })
      .attr('fill', d => {
        const result = data.find(item => item.fips === d.id)
        return result ? colorScale(result.bachelorsOrHigher) : colorScale(0)
      })
      .on('mouseover', (event, d) => {
        const result = data.find(item => item.fips === d.id)
        tooltip.style('opacity', 0.9)
          .html(
            result
              ? `${result.area_name}, ${result.state}: ${result.bachelorsOrHigher}%`
              : 'No data available'
          )
          .attr('data-education', result ? result.bachelorsOrHigher : 0)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px')
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0)
      })

    // Create legend
    const legendWidth = 200
    const legendHeight = 10
    const legendCellWidth = legendWidth / 8

    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${(width - padding) * 0.67}, ${height - padding})`)

    legend.selectAll('rect')
      .data(colorScale.range().slice(0, -1))
      .enter()
      .append('rect')
      .attr('x', (d, i) => legendCellWidth * i)
      .attr('y', 0)
      .attr('width', legendCellWidth)
      .attr('height', legendHeight)
      .attr('fill', d => d)

    // Add legend axis
    const legendScale = d3.scaleLinear()
      .domain([minEducation, maxEducation])
      .range([0, legendWidth])

    const legendAxis = d3.axisBottom(legendScale)
      .tickFormat(d => Math.round(d) + '%')
      .tickSize(13)
      .tickValues(colorScale.domain())

    legend.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .select('.domain')
      .remove()
    
  }, [data, counties])
 

  return (
    <>
      <div className='app-div'>
        <header>
          <p>This is in implementation of Choropleth of US Education Attainment</p>
        </header>
       
       <svg ref={svgRef}></svg>
       
       
       <footer className="footer">
        <p>
          Coded and Designed by <strong>Sina Kiamehr</strong>
        </p>
      </footer>
        
      </div>
    </>
  )
}

export default App
