import React, { useState, useEffect } from "react";
// import { useUpdateEffect, useMount } from "react-use";
import socketIOClient from "socket.io-client";
import Web3 from "web3";
import DataRW from "../abis/DataRW.json";

import LineChart from "./LineChart";

const Moralis = require("moralis").default;

const App = () => {
  const [state, setState] = useState({
    getData: [],
    dataHash: "",
    metamaskAC: "",
    dataLen: 0,
    dataSetFlag: false,
    transactionHash: "...",
    blockHash: "...",
    blockNumber: null,
    toAccount: "0x???",
    gasUsed: "...",
  });

  let nakedDataHash = null;
  let metamaskAC = null;
  let globalContract = null;

  let tempArray = [];
  let uploadArray = [
    {
      path: "myJson.json",
      content: ["helloData"],
    },
  ];

  // useMount(() => {
  //   loadWeb3();
  //   loadBlockchainData();
  // }, []);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const getMethodContract = async (reciept) => {
    if (globalContract !== null) {
      const newDataHash = await globalContract.methods.get().call();
      await fetch(newDataHash)
        .then((response) => response.json())
        .then((data) => setState({ ...state, getData: data }));
      console.log("new data hash:::", state.getData);
    }

    setState({
      ...state,
      transactionHash: reciept.transactionHash,
      blockHash: reciept.blockHash,
      blockNumber: reciept.blockNumber,
      toAccount: reciept.to,
      gasUsed: reciept.gasUsed,
    });
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = await DataRW.networks[networkId];
    metamaskAC = accounts[0];
    setState({ ...state, metamaskAC });

    if (networkData) {
      const abi = DataRW.abi;
      const address = networkData.address;
      // fetching the smart contract
      const contract = new web3.eth.Contract(abi, address);
      globalContract = contract;
    } else {
      window.alert("Smart contract not detected yet!");
    }
  };

  // connect to web3
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.eth;
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please use metamask matchaa!");
    }
  };

  // moralis and ipfs
  const sendToIpfs = async () => {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          "GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP",
        // "p1KL1YbNWDDp5dwj3Fe0Bj2faF24D6TzohCpXDs4VwjuhiI50CZj6sg9dza8ABh9",
        // "nKSWZVtJHjaGNOANNL88yVOcDGtM12SpVHvAyfiL7Igy6FhapVLkoDoqrDw75lV5",
      });
    }

    console.log("abi:::", uploadArray);
    if (uploadArray[0].content.length === state.dataLen + 10) {
      console.log("data length:>", state.dataLen);
      const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
      });

      nakedDataHash =
        response.result[0].path !== null ? response.result[0].path : "";

      setState({ ...state, dataHash: nakedDataHash });
    }
  };

  const socket = socketIOClient("http://127.0.0.1:4001/");
  socket.on("message", (data) => {
    tempArray.push(data);

    console.log("got the data:: ", data);

    if (
      tempArray.length % 10 === 0 &&
      tempArray.length === state.dataLen + 10
    ) {
      uploadArray[0].content = tempArray;
      console.log(uploadArray[0].content);
      sendToIpfs();

      if (nakedDataHash !== null) {
        console.log("got you here!", nakedDataHash);
        if (globalContract !== null) {
          globalContract.methods
            .set(nakedDataHash)
            .send({ from: metamaskAC })
            .then((reciept) => {
              getMethodContract(reciept);
              console.log("set reciept:>", reciept);
            });
        }
      }
      state.dataLen = tempArray.length;
    }
  });

  return (
    <div>
      {/* <LineChart data={state.getData} /> */}
      <p>My Account (ether sender): {state.metamaskAC} </p>
      <p>Reciever Account (ether reciever): {state.toAccount} </p>
      <br />
      <br />
      <p>Transaction Hash: {state.transactionHash}</p>
      <p>Block Hash: {state.blockHash}</p>
      <p>Block Number: {state.blockNumber}</p>
      <p>Gas fees used: {state.gasUsed} </p>
    </div>
  );
};

export default App;
