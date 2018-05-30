import React from 'react';
import ReactDOM from 'react-dom';
import autobahn from 'autobahn';
import 'bootstrap/dist/css/bootstrap.css';

class Client extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '???',
      score: 0,
    };
    this.session = null;
    this.id = null;
    this.connection = new autobahn.Connection({url: `ws://${window.location.hostname}:8088/ws`, realm: 'kuiz'});
    this.connection.onopen = (session) => {
      this.session = session;
      session.call('kuiz.registerClient')
        .then(res => {
        this.setState(() => ({ name: res.name, score: res.score }));
        this.id = res.id;
        })
        .catch(err => { console.error('could not call register method', err); });
      session.subscribe('kuiz.setScore', this.onSetScore);
    };
    this.onBuzz = this.onBuzz.bind(this);
    this.onSetScore = this.onSetScore.bind(this);
  }
  componentDidMount() {
    this.connection.open();
  }
  onSetScore([clientId, score]) {
    if (this.id == clientId) {
      this.setState(() => ({ score }));
    }
  }
  onBuzz() {
    if (!this.session || !this.id) {
      console.error('Could not buzz! Uninitialized client');
    }
    this.session.publish('kuiz.buzz', [this.id]);
  }
  render() {
    return (
      <div>
        <div className="container">
          <h1>Team {this.state.name}</h1>
          <button type="button" onClick={this.onBuzz} className="btn btn-primary btn-block btn-lg" style={{height: '300px'}}>Répondre</button>
          <p>Score: {this.state.score}</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Client />, document.getElementById('root'));
