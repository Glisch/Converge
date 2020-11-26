import React, { Component } from "react";
import ConvergeContract from "./contracts/Converge.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, groups: null, meetings: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ConvergeContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ConvergeContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a test/default meeting
    await contract.methods.addGroup("Test Name", "Test Description", "Test Location").send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    const groupResponse = await contract.methods.getGroups  ().call();
    // Update state with the result.
    this.setState({ groups: groupResponse });

    // Stores a test/default meeting
    await contract.methods.addMeeting("Test Title", "Test Topic", "Test Location", parseInt((new Date()).getTime() / 1000)).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    const meetingResponse = await contract.methods.getMeetings().call();
    // Update state with the result.
    this.setState({ meetings: meetingResponse });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>The stored groups: {this.state.groups}</div>
        <div>The stored events: {this.state.meetings}</div>
      </div>
    );
  }
}

export default App;
