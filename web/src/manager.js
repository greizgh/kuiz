import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';
import 'bootstrap/dist/css/bootstrap.css';
import ScoreRow from './components/ScoreRow';
import sound from '../res/buzz.ogg';

class Manager extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      canBuzz: true,
    };
    this.onNewClient = this.onNewClient.bind(this);
    this.setScore = this.setScore.bind(this);
    this.onBuzz = this.onBuzz.bind(this);
    this.onReset = this.onReset.bind(this);
    this.session = null;
    this.connection = new autobahn.Connection({url: `ws://${window.location.hostname}:8088/ws`, realm: 'kuiz'});
    this.connection.onopen = (session) => {
      this.session = session;
      session.call('kuiz.getClients')
        .then(res => {
        this.setState(() => ({ clients: res }));
        })
        .catch(err => { console.error('could not fetch clients', err); });
      session.subscribe('kuiz.newClient', this.onNewClient);
      session.subscribe('kuiz.buzz', this.onBuzz);
    };
    this.sound = new Audio(sound);
  }
  onNewClient(client) {
    this.setState(prev => ({ clients: prev.clients.concat(client) }));
  }
  componentDidMount() {
    this.connection.open();
  }
  setScore(client, score) {
    this.session.publish('kuiz.setScore', [client.id, score]);
    this.setState(prevState => ({ clients: prevState.clients.map(c => {
      if (c.id === client.id) {
        return Object.assign({}, c, { score });
      } else {
        return c;
      }
    }) }));
  }
  onBuzz([clientId]) {
    this.setState(prevState => ({
      clients: prevState.clients.map(c => {
        if (c.id == clientId && prevState.canBuzz) {
          this.sound.play();
          return Object.assign({}, c, { buzzing: true });
        } else {
          return c;
        }
      }),
      canBuzz: false,
    }));
  }
  onReset() {
    this.setState(prevState => ({
      canBuzz: true,
      clients: prevState.clients.map(c => Object.assign({}, c, { buzzing: false })),
    }));
  }
  render() {
    const incdec = (client, i) => () => this.setScore(client, client.score + i);
    return (
      <div className="container">
        <h1>Gestion des scores</h1>
        <table>
          <thead>
            <tr>
              <th scope="col">Team</th>
              <th scope="col">Score</th>
              <th scope="col">Action</th>
              <th scope="col">Buzz</th>
            </tr>
          </thead>
          <tbody>
            {this.state.clients.map(client => <ScoreRow key={client.id} name={client.name} score={client.score} onDec={incdec(client, -1)} onInc={incdec(client, 1)} buzzing={client.buzzing} onReset={this.onReset}/>)}
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Manager />, document.getElementById('root'));
