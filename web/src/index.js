import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode-react';
import 'bootstrap/dist/css/bootstrap.css';

const CLIENT_PATH = 'client.html';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      clientUrl: CLIENT_PATH,
    };
  }
	componentDidMount() {
    let clientUrl = `http://${window.location.host}/${CLIENT_PATH}`;
    this.setState(() => ({ clientUrl }));
	}
  render() {
    return (
      <div>
        <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h1 className="display-4">Kuiz</h1>
          <p className="lead">Réponds-y donc aux questions!</p>
        </div>
        <div className="container">
          <div className="card-deck mb-3 text-center">
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Manager</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title">Qui c'est le patron?</h1>
                <a href="/manager.html" className="btn btn-lg btn-block btn-primary">Go go go</a>
              </div>
            </div>
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Participant</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title">Répond!</h1>
                <a href={this.state.clientUrl}>
                  <QRCode value={this.state.clientUrl} size={256} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
