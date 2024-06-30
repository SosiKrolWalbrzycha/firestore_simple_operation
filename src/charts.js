import React, { useState, useEffect, useContext } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine } from 'recharts'
import styled from 'styled-components';
import CustomTooltip from './tooltip_recharts.js' // Importuj niestandardowy komponent Tooltip

const StyledList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style-type: square;
  padding: 0;
  margin: 0;

  @media (max-width: 992px) {
    display: none;
  }
`;



const Chart = ({ data }) => {
	const [chartWidth, setChartWidth] = useState(window.innerWidth * 1)
	const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.6)
	const [fontSize, setFontSize] = useState('14px');
	const [margins, setMargins] = useState({ top: 20, right: 20, left: 0, bottom: 0 });


	const updateDimensions = () => {
		setChartWidth(window.innerWidth * 1);
		setChartHeight(window.innerHeight * 0.6);
	
		if (window.innerWidth > 1200) {
		  setFontSize('14px');
		  setMargins({ top: 20, right: 20, left: -3, bottom: 20 });
		  
		} else if (window.innerWidth > 576 && window.innerWidth <= 1200) {
		  setFontSize('12px');
		  setMargins({ top: 15, right: 20, left: -10, bottom: 0 });
		} else {
		  setFontSize('10px');
		  setMargins({ top: 0, right: 5, left: -30, bottom: 0 });
		}
	  };

	// Nasłuchiwanie na zmiany rozmiaru okna
	useEffect(() => {
		updateDimensions(); // Inicjalne ustawienie
	
		window.addEventListener('resize', updateDimensions);
	
		// Czyszczenie event listenera
		return () => window.removeEventListener('resize', updateDimensions);
	  }, []);

	const maxAbsValue = Math.max(...data.map(item => Math.abs(item.wartość)))

	const renderLegend = (props) => {
		return (
			<StyledList>
				 <li style={{ color: '#FF8383', padding:"0px 100px 20px 30px" }}>
					Zakup walut - obciążenie Twojego konta w PLN
				</li>
				<li style={{ color: '#86FF8A' }}>
					Sprzedaż walut - uznanie na Twoim koncie w PLN
				</li>
			</StyledList>
		);
	};
	return (
		<BarChart width={chartWidth} height={chartHeight} data={data} margin={margins}>
			<CartesianGrid strokeDasharray='1 4' />
			<XAxis dataKey='date' tick={{ fontSize: fontSize }} />
			<YAxis tick={{ fontSize: fontSize }}/>
			<Tooltip content={<CustomTooltip />} />
			<Legend 
      content={renderLegend} 
      verticalAlign="top" 
      align="center" 
      layout="horizontal" 
      wrapperStyle={{ lineHeight: '24px' }}
    />
			<ReferenceLine y={0} stroke='#000' /> {/* Dodanie linii odniesienia na poziomie wartości 0 */}
			<Bar dataKey='value' radius={[5, 5, 0, 0]}>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={entry.value < 0 ? '#FF8383' : '#86FF8A'} />
				))}
			</Bar>
		</BarChart>
	)
}
export default Chart
