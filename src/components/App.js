import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import 'antd/dist/antd.css';

const Container = styled.div`
  width: 960px;
  margin: auto;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Route path="/" exact component={FirstPage} />
        <Route path="/edit" component={SecondPage} />
      </Container>
    );
  }
}

export default App;
