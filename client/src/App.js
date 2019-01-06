import React, { Component } from "react";
import "./App.css";
import { subscribeToChat, sendPackage, socket, verifyMessage } from "./api";

class App extends Component {
  constructor(props) {
    super(props);
    subscribeToChat();
    this.state = {
      data: [],
      valueMessage: "",
      valueReceiver: ""
    };
  }

  componentDidMount = () => {
    // listen event from server
    socket.on("connected", () => {
      console.log("connect sucessful");
    });
    socket.on("package", d => {
      console.log(d);
      d.verify = verifyMessage(d.encrypted, d.signature, d.publicKey);
      const data = [...this.state.data];
      data.push(d);
      this.setState({ data });
    });
  };

  handleChangeMessage = event => {
    this.setState({ valueMessage: event.target.value });
  };

  handleChangeReceiver = event => {
    this.setState({ valueReceiver: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    sendPackage(this.state.valueMessage, this.state.valueReceiver);
  };

  render() {
    const { data } = this.state;
    const messagesList = data.length ? (
      data.map(d => (
        <div className="message" key={Math.random()}>
          <p className="teal-text darken-4">
            ================================================================================================
          </p>
          <p className="small-text">From: {d.name}</p>
          <p className="small-text container">{d.publicKey}</p>
          <p className={"small-text" + (d.receiver === "" ? " hide" : "")}>
            To:
          </p>
          <p
            className={
              "small-text container" + (d.receiver === "" ? " hide" : "")
            }
          >
            {d.receiver}
          </p>
          <p className={"small-text " + (d.verify ? "green" : "red") + "-text"}>
            Signature: {d.signature}
          </p>
          <p className={(d.receiver === "" ? "indigo" : "red") + "-text"}>
            Message: {d.encrypted}
          </p>
        </div>
      ))
    ) : (
      <blockquote className="red-text darken-4">No message</blockquote>
    );
    return (
      <div className="container">
        <h2 className="deep-purple-text">{process.env.REACT_APP_USER}</h2>
        <div id="content-table">{messagesList}</div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input
              type="text"
              name="message"
              onChange={this.handleChangeMessage}
            />
          </label>
          <label>
            Receiver:
            <input
              type="text"
              name="receiver"
              onChange={this.handleChangeReceiver}
            />
          </label>
          <button className="btn pink lighten-1 waves-effect waves-light pulse">
            <span>send</span>
            <i className="material-icons right yellow-text">send</i>
          </button>
        </form>
      </div>
    );
  }
}

export default App;
