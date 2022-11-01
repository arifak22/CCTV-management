import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API, params, header, Assets } from '../../Api';

import { SwalResult, SwalLoading } from '../../Component/Helper';

import DetailINC from '../Incident/detail';

import DailyTable from '../Report/tableDaily';

import 'moment/locale/id';
import TableList from '../../Component/TableComponent';

var moment = require('moment');

class IncidentList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
     data        : null,
     loading     : true,
     query       : "page=1&row=10",
    }
  }
  componentDidMount(){
    this.getData();
    this.props.total(null);
  }

  doDelete(id){
    Swal.fire({
      title            : 'Apakah anda yakin ? ',
      icon             : 'info',
      text             : 'Menghapus data ini ?',
      showCancelButton : true,
      focusConfirm     : false,
      confirmButtonText: 'Ya',
      cancelButtonText : 'Cancel',
    }).then((result)=>{
      if(result.value){
        SwalLoading();
        axios.post(API().deleteIncident, params({id: id}), header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
              Swal.fire({
                title            : 'Sukses!',
                text             : res.api_message,
                icon             : 'success',
                confirmButtonText: 'OK',
              });
              this.getData();
            }
        })
        .catch((error) => {
          Swal.fire({
            title            : 'Error!',
            text             : error.toString(),
            icon             : 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    })
  }
  columns = [
    {
      title   : '',
      field   : null,
      width   : 60,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.props.doRead(row.id_inc)} title="Detail" className="btn-info btn-brand icon btn-sm">
                    <i style={{color:'#fff'}} className="cui-magnifying-glass"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'CCTV',
      field: 'kode_cctv',
      template: (row) =>{
        return row.kode_cctv + ' (' + row.nama_cctv + ')';
      }
    }, 
    {
     title: 'Waktu Incident/Rusak',
     field: 'waktu_start',
     template: (row)=>{
       return moment(row.waktu_start).format("dddd, DD MMMM YYYY - HH:mm");
     }
    }, 
    {
     title: 'Status',
     field: 'nama_status',
     template: (row)=>{
      return row.nama_status;
    }
    }, 
    {
     title: 'Keterangan',
     field: 'keterangan',
     template: (row)=>{
       return row.keterangan;
     }
    }
  ];

  getData(){
    this.setState({loading: true});
    axios.get(API().getIncident + "?status=0&" + this.state.query, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({data: res.data, loading: false});
          this.props.total(res.data.total);
        }else{
          this.props.total(0);
        }
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
  handleRespone = data => {
    const { query } = data;
    this.setState({query: query}, () => {
      this.getData();
    });
  }
  render(){
    return(
      <TableList
          data          = {this.state.data}
          columns       = {this.columns}
          loading       = {this.state.loading}
          handleRespone = {this.handleRespone}
      />
    )
  }
}
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.randomNumber = 0;
    this.interval = null;

    this.generateRandomNumber = this.generateRandomNumber.bind(this)
    this.state = {
      totalCctv    : 0,
      totalMt      : 0,
      totalIncident: 0,
      totalRusak   : 0,
      isRand       : true,
      data         : [],
      lastday      : 31,
    };
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  componentDidMount(){
    this.generateRandomNumber(); // calls it the first time and the setInterval will keep running
    this.getCard();
    this.getDaily();
  }

  newRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  generateRandomNumber(){
    this.interval = setInterval(() => {
      document.getElementById("random1").innerHTML = this.newRandomNumber(1, 100)
      document.getElementById("random2").innerHTML = this.newRandomNumber(1, 100)
      document.getElementById("random3").innerHTML = this.newRandomNumber(1, 100)
      document.getElementById("random4").innerHTML = this.newRandomNumber(1, 100)
    }, 100)
  }

  getCard(){
    axios.get(API().getCard, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          clearInterval(this.interval);
          this.setState({isRand: false, totalCctv: res.data.cctv, totalIncident: res.data.incident, totalRusak: res.data.rusak, totalMt: res.data.mt });
        }
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  getDaily(){
    axios.get(API().getDaily, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
            this.setState({data: res.data, lastday: res.lastday});
        }else{
            this.setState({submited: false});
        }
    }).catch((error) => {
        Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
        });
    });
  }

  
  doRead(id){
    this.setState({pageLoading: true});
    axios.get(API().detailIncident + "?id="+id, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        this.setState({pageDetail: true, detailData: res.data, pageLoading: false});
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
  render() {
    if(this.state.pageDetail){
      return (<DetailINC
                data   = {this.state.detailData}
                goBack = {(value) => this.setState({pageDetail:false})}
              />)
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0"> 
                <div className="text-value">{this.state.isRand ? <div id="random1"></div> : this.state.totalCctv }</div>
                <div>Total Kamera</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '20px' }}></div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-success">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.isRand ? <div id="random2"></div> : this.state.totalMt }</div>
                <div>Di maintenance bulan ini</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '20px' }}></div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.isRand ? <div id="random3"></div> : this.state.totalIncident }</div>
                <div>Kamera incident</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '20px' }}></div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.isRand ? <div id="random4"></div> : this.state.totalRusak }</div>
                <div>Kamera Rusak</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '20px' }}></div>
            </Card>
          </Col>

        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
               Incident {'&'} Rusak
              </CardHeader>
              <CardBody>
                <IncidentList 
                  total    = {(total) => this.setState({total: total})}
                  doRead   = {(id) => this.doRead(id)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader>
               Daily Report
              </CardHeader>
              <CardBody>
                <DailyTable
                  data    = {this.state.data}
                  lastday = {this.state.lastday}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
