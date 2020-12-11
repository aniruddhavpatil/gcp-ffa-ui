import logo from './logo.svg';
import './App.css';
import { Button, Input } from '@material-ui/core';
import React from 'react';
import axios from 'axios';

const makeRequest = (file) => {
  console.log('Reached makeRequest');
  // console.log('file', file);

  // const url = 'https://hookb.in/Mq6MK39mwBHBKK6OLnVO';
  // const url = 'http://127.0.0.1:5000';

  const url = 'https://us-central1-gcp-ffa.cloudfunctions.net/gcp_cors';
  let data = new FormData();

  data.append(file.name, file, file.name);
  console.log('filename',file.name)
  axios.post(url, data, {
    headers: {
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    }
  })
  .then((response) => {
    console.log(response);
  }).catch((error) => {
    //handle error
  });
};

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  selectFile = event => {
    // console.log('etf',event.target.files[0])
    this.setState(
      {selectedFile: event.target.files[0]}
    ,
    () => console.log('selectedfile',this.state.selectedFile)
    )
  }

  render(){
    return(
    <div>
      <Input type="file" onChange={(e) => this.selectFile(e)}>Choose File</Input>
      <Button color="primary" onClick={() => makeRequest(this.state.selectedFile) }>Hello World</Button>
    </div>);
  }

}

export default App;
