import React from 'react';
import styled from 'styled-components';

const StyledP = styled.p`
font-size: 16px;

@media (max-width: 992px) {
  font-size: 14px;
  }

  @media (max-width: 576px) {
  font-size: 12px;
  }
`

const CustomTooltip = ({ active, payload, label }) => {
  console.log(payload);
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#ffffff', border: '1px solid black', padding: '10px', borderRadius: '5px' }}>

        <StyledP className="label">{`Data: ${label}`}</StyledP>

        <StyledP className="value" style={{ color: payload[0].value < 0 ? 'red' : 'green' }}>

        {`${payload[0].value < 0  ? 'Kupiłeś' : 'Sprzedałeś'} ${payload[0].value < 0  ? payload[0].payload.toCurrency : payload[0].payload.fromCurrency}`}
        
        </StyledP>

        <StyledP className="value" style={{ color: payload[0].value < 0 ? 'red' : 'green' }}>
          
        {`Saldo transakcji w PLN: ${payload[0].value} PLN`}
        
        </StyledP>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;