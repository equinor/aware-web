import React from 'react';
import styled from 'styled-components';
import EventContainer from './EventContainer';

function getMostSevereAlert(events) {
  let mostSever = 'ok';
  if (events.some(event => event.severity === 'none')) {
    mostSever = 'none'
  }
  if (events.some(event => event.severity === 'warning')) {
    mostSever = 'warning'
  }
  if (events.some(event => event.severity === 'critical')) {
    mostSever = 'critical'
  }
  return mostSever
}

const Header = styled.h1`
  margin: 0px;
  padding: 20px;
`;

const AppContainer = styled.div`
  background: ${props => props.backgroundColor};
  margin: 0px;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      events: []
    };
  }

  refetchData() {
    fetch("/api/prometheus")
      .then(res => res.json())
      .then(
        (result) => {
          let background;
          switch (getMostSevereAlert(result)) {
            case 'none':
              background = '#747474';
              break;
            case 'ok':
              background = '#86C232';
              break;
            case 'warning':
              background = '#FF652F';
              break;
            case 'critical':
              background = '#FC4445';
              break;
            default:
              background = 'white';
          }
          this.setState({
            isLoaded: true,
            events: result,
            backgroundColor: background,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    this.refetchData();
    this.interval = setInterval(() => this.refetchData(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { error, isLoaded, events, backgroundColor } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <AppContainer backgroundColor={backgroundColor}>
          <Header>SDP AKS Production</Header>
          <EventContainer events={events}/>
        </AppContainer>
      );
    }
  }
}

export default App;
