import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Table } from 'reactstrap';
import { Assets } from '../../Api';
import 'moment/locale/id';
var moment = require('moment');

export default class DetailINC extends Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        activeTab: '1',
      };
    }
    valueDetail(label, value){
      return(<tr>
        <td width={200}>{label}</td>
        <td width={5}>:</td>
        <td>{value}</td>
      </tr>);
    }
    toggle(tab) {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
        });
      }
    }
    render(){
      let status = [
        {
          name: 'Incident',
          class: 'badge badge-warning'
        },
        {
          name: 'Selesai',
          class: 'badge badge-success'
        },
        {
          name: 'Selesai',
          class: 'badge badge-success'
        },
      ];
      if(this.props.data){
        const tbodyDom = [];
        let tempRow = [];
        if(this.props.data.foto.length < 1){
          tbodyDom.push(<tr key={0}><td>Belum Ada</td></tr>);
        }
        this.props.data.foto.forEach((record, key) => {
          if (key % 2 !== 0) {
            tempRow.push(<td style={{verticalAlign:'middle'}} align="center" key={key}><img className={record.is_use == 1 ? 'img-success' : 'img-list'} src={Assets(record.file)}/></td>);
          } else {
            tempRow.push(<td style={{verticalAlign:'middle'}} align="center" key={key}><img className={record.is_use == 1 ? 'img-success' : 'img-list'} src={Assets(record.file)}/></td>);
          }

          if (tempRow.length >= 2) {
            tbodyDom.push(<tr key={key}>{tempRow}</tr>);
            tempRow = [];
          }
        });

        //munculkan kolom terakhir jika total data berupa ganjil
        if (tempRow.length > 0) {
          tbodyDom.push(<tr key={0}>{tempRow}</tr>);
        }

        return(
          <div className="animated fadeIn">
            <Row>
              <Col md="7">
                <Card>
                  <CardHeader>
                    <strong>Detail</strong>
                  </CardHeader>
                  <CardBody>
                    <Table hover bordered striped responsive>
                      <tbody>
                        {this.valueDetail('Cabang', this.props.data.incident.nama_cabang)}
                        {this.valueDetail('Lokasi', this.props.data.incident.nama_lokasi)}
                        {this.valueDetail('CCTV', this.props.data.incident.kode_cctv + ' (' + this.props.data.incident.nama_cctv + ')')}
                        {this.valueDetail('Waktu Incident', moment(this.props.data.incident.waktu_start).format("dddd, DD MMMM YYYY - HH:mm"))}
                        {this.valueDetail('Waktu Selesai', moment(this.props.data.incident.waktu_finish).format("dddd, DD MMMM YYYY - HH:mm"))}
                        {this.valueDetail('Status', this.props.data.incident.code_inc == 0 ? <span className="badge badge-warning">Masih Incident</span> : <span className="badge badge-success">Selesai</span>)}
                        {this.valueDetail('Status Incident',  <span className="badge badge-warning">{this.props.data.incident.nama_status}</span>)}
                        {this.valueDetail('Keterangan',  this.props.data.incident.keterangan)}
                        {this.valueDetail('Perbaikan',  this.props.data.incident.perbaikan)}
                        {this.valueDetail('Created At', moment(this.props.data.incident.created_at).format("dddd, DD MMMM YYYY - HH:mm"))}
                        {this.valueDetail('Created By', this.props.data.incident.nama_created)}
                        {this.valueDetail('Finish At', this.props.data.incident.finish_at ? moment(this.props.data.incident.finish_at).format("dddd, DD MMMM YYYY - HH:mm") : null)}
                        {this.valueDetail('Finish By', this.props.data.incident.nama_finish)}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              <Col md="5">
                <Card>
                  <CardHeader>
                    <strong>History</strong>
                    <div className="card-header-actions">
                      <Button onClick={()=> this.props.goBack(true)} size="sm" color="warning">
                        <i className="cui-chevron-left"></i> 
                        {' '}<span>Back</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody style={{height:'300px', maxHeight: '300', overflowY : 'scroll'}}>
                    {this.props.data.history.map((value, key) =>
                      <React.Fragment key={key}>
                        <div className="message">
                          <div className="py-3 pb-5 mr-3 float-left" style={{paddingTop:'0rem !important'}}> 
                            <div className="avatar">
                              <img src={Assets(value.foto)} className="img-avatar"/>
                            </div>
                          </div>
                          <div>
                            <small className="text-muted">{moment(value.created_at).format("dddd, DD MMMM YYYY - HH:mm")}</small>
                            <small className="text-muted float-right mt-1"><span className={status[value.status_update].class}>{status[value.status_update].name}</span></small>
                          </div>
                          <div className="text-truncate font-weight-bold">{value.nama}</div>
                          <small className="text-muted">{value.keterangan + ' - (Status: ' + value.nama_status + ')'}
                          </small>
                        </div>
                        <hr/>
                    </React.Fragment>)}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="7">
                <Card>
                  <CardHeader>
                    <strong>Foto</strong>
                  </CardHeader>
                  <CardBody>
                  <h5>Foto View</h5>
                    <Table hover bordered striped responsive>
                      <tbody>
                        <tr>
                          <td><b>Before</b></td>
                          <td><b>After</b></td>
                        </tr>
                        <tr>
                          <td style={{verticalAlign:'middle'}} align="center">{this.props.data.incident.foto_before ? <img className="img-list" src={Assets(this.props.data.incident.foto_before)}/> : 'Belum Ada' }</td>
                          <td style={{verticalAlign:'middle'}} align="center">{this.props.data.incident.foto_after ? <img className="img-list" src={Assets(this.props.data.incident.foto_after)}/> : 'Belum Ada' }</td>
                        </tr>
                      </tbody>
                    </Table>
                    <h5>Foto Kegiatan</h5>
                    <Table hover bordered striped responsive>
                      <tbody> 
                        {tbodyDom}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        )
      }else{
        return (<div>Loading...</div>)
      }
    }
  }