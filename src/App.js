import './App.css';
import { Button, Input, Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';




class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedFile: null,
      mockData: {
        url: "https://storage.googleapis.com/gcp-ffa-images/decoded.png",
        objects: [
          {
            confidence: 0.715476930141449,
            name: "Furniture",
            vertices: [
              [0.22910742461681366, 0.6642104983329773],
              [0.9094800353050232, 0.6642104983329773],
              [0.9094800353050232, 0.970264196395874],
              [0.22910742461681366, 0.970264196395874]
            ]
          },
          {
            confidence: 0.6027265787124634,
            name: "Animal",
            vertices: [
              [0.1031908392906189, 0.3685891628265381],
              [0.5166164040565491, 0.3685891628265381],
              [0.5166164040565491, 0.809562623500824],
              [0.1031908392906189, 0.809562623500824]
            ]
          }
        ],
        labels: [{'name': 'Line', 'score': 0.9335631132125854}, {'name': 'Monochrome', 'score': 0.842336893081665}, {'name': 'Black-and-white', 'score': 0.838517963886261}, {'name': 'Cartoon', 'score': 0.824815034866333}, {'name': 'Parallel', 'score': 0.810519814491272}, {'name': 'Rectangle', 'score': 0.7979581952095032}, {'name': 'Illustration', 'score': 0.7849830389022827}, {'name': 'Artwork', 'score': 0.7789515852928162}, {'name': 'Handwriting', 'score': 0.776343822479248}, {'name': 'Line art', 'score': 0.7367836236953735}]
      }
    };
  }
  
  makeRequest = (file) => {
  console.log('Reached makeRequest');
  // console.log('file', file);

  // const url = 'https://hookb.in/Mq6MK39mwBHBKK6OLnVO';
  // const url = 'http://127.0.0.1:5000';

  // const url = 'https://us-central1-gcp-ffa.cloudfunctions.net/gcp_cors';
  // const url = 'https://us-central1-gcp-ffa.cloudfunctions.net/gcp_ffa_cache'
  const url = 'https://us-central1-gcp-ffa.cloudfunctions.net/gcp-ffa-labels-cache'
  let data = new FormData();
  let d = new Date();
  const startTime = d.getTime();
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
    d = new Date();
    const endTime = d.getTime();
    const responseTime = <div>Response Time: {endTime - startTime} ms</div>;
    console.log(startTime, endTime);
    console.log('response time', responseTime)
    console.log(response);
    this.setState({mockData: response.data, responseTime: responseTime});
    //TODO: RETURN response.data;
  }).catch((error) => {
    //handle error
  });
};

  selectFile = event => {
    // console.log('etf',event.target.files[0])
    this.setState(
      {selectedFile: event.target.files[0]}
    ,
    () => console.log('selectedfile',this.state.selectedFile)
    )
  }

  setDimensions = event => {
    this.setState({
      imgHeight: event.target.naturalHeight,
      imgWidth: event.target.naturalWidth
    })
  }

  plot = () => {
    console.log(this.state.mockData);
    const p1 = this.state.mockData.objects[0].vertices[0];
    const p2 = this.state.mockData.objects[0].vertices[2];
    const boxWidth = (p2[0] - p1[0]) * 100;
    const boxHeight = (p2[1] - p1[1]) * 100;
    const bbStyle = {
          'position': 'absolute',
          'top': parseFloat(p1[1] * 100 * this.state.imgHeight) + 'px',
          'left': parseFloat(p1[0] * 100 * this.state.imgWidth) + 'px',
          'width': parseFloat(boxWidth * this.state.imgWidth) + 'px',
          'height': parseFloat(boxHeight * this.state.imgHeight) + 'px',
          'border': '2px solid #ff0000',
          'backgroundColor': 'transparent'
      };
    console.log('bbStyle', bbStyle);
    const result = <div>
      <img src={this.state.mockData.url} alt="new" onLoad={(event) => this.setDimensions(event)}/>
      {/* <div style={
        bbStyle
      }></div> */}
      <Card>
        <CardContent>
        {this.state.mockData.objects.map((item, i) => <div id={'object_' + parseInt(i)}>
          <div>Item: {item.name}</div>
          <LinearProgress variant="determinate" value={item.confidence * 100} />
    <div>Confidence: {item.confidence * 100}%</div>
          <div>
            {item.vertices.map((vertex, v) => <div id={'vertex_' + parseInt(i) + '_' + parseInt(v)}>
                <div>vx: {vertex[0]}, vy: {vertex[1]}</div>
            </div>)}
          </div>
        </div>)}
        </CardContent>
      </Card>
      </div>
    this.setState({result: result}, console.log(this.state.result));
  }

  showLabels = () => {
    const labels = this.state.mockData.labels;
    console.log(labels);
    // labels.map((item, i) => {
    //   console.log('name', item.name);
    //   console.log('score', item.score);
    // })
    const labelDivs = labels.map((item, i) => {
          console.log(item.name);
          return <div id={'item_' + parseInt(i)}>
            <div>{item.name}: {item.score * 100}%</div>
            <LinearProgress variant="determinate" value={item.score * 100} />
          </div>
        })
    console.log('labelDivs', labelDivs);
    const result = <div><img src={this.state.mockData.url} alt="new" onLoad={(event) => this.setDimensions(event)}/>
    <Card>
      <CardContent>
        {labelDivs}
        </CardContent>
        </Card>
    </div>
    // const result = <LinearProgress variant="determinate" value={80} />
    this.setState({result: result}, () => console.log(this.state.result));

  }

  render(){
    return(
    <div>
      <Typography>Image Analyzer</Typography>
      <Input type="file" onChange={(e) => this.selectFile(e)}>Choose File</Input>
      <Button color="primary" onClick={() => this.makeRequest(this.state.selectedFile) }>Upload Image</Button>
      <Button color="primary" onClick={() => this.plot()}>Show Objects</Button>
      <Button color="primary" onClick={() => this.showLabels()}>Show Labels</Button>
      <div>{this.state.responseTime}</div>
      {this.state.result}
    </div>);
  }

}

export default App;
