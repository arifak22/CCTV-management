import React, { Component, useState, useEffect  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input, Table, FormFeedback,Nav, NavItem, NavLink, TabContent, TabPane, Badge, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { SelectForm, DateForm, FileForm, getError } from '../../Component/FormComponent';
import { SwalResult, SwalLoading, makeid } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
import Resizer from 'react-image-file-resizer';
import TableList from '../../Component/TableComponent';
import DetailMT from './detail';
import Datetime from 'react-datetime';

import 'moment/locale/id';
var moment = require('moment');
var fileDownload = require('js-file-download');
function Filter(props){
    const { register, handleSubmit, errors, reset } = useForm();
    const [bulan, setBulan]         = useState(null);
    const [tglstart, setTglstart]   = useState(null);
    const [tglfinish, setTglfinish] = useState(null);
    const [tipe, setTipe]           = useState('bulan');
    const onSubmit = data => props.onSubmit(data);

    var now = Date.now();
    var valid = function( current ){
        return current.isBefore( now );
    };
    var validStart = function( current ){
        if(tglfinish){
            return current.isBefore( now ) && current.isSameOrBefore(tglfinish);
        }else{
            return current.isBefore( now );
        }
    };
    var validFinish = function( current ){
        if(tglstart){
            return current.isBefore( now ) && current.isSameOrAfter(tglstart);
        }else{
            return current.isBefore( now );
        }
    };
    return(
        <Row>
            <Col>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup row>
                        <Col md="4">
                            <Label>Tipe Report</Label>
                        </Col>
                        <Col md="8">
                            <Input 
                                innerRef = {register({
                                    required: true,
                                })}
                                name     = "tipe"
                                type     = "select"
                                onChange = {(e) => setTipe(e.target.value)}
                            >
                                <option value="bulan">Bulanan</option>
                                <option value="hari">Harian</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="4">
                            <Label>Cabang</Label>
                        </Col>
                        <Col md="8">
                            <Input 
                                innerRef = {register()}
                                name     = "cabang"
                                type     = "select"
                            >
                                {props.optionCabang ? 
                                props.optionCabang.map((option, key) =>
                                    <option key={key} value={option.value}>
                                    {option.name}
                                    </option>
                                )
                                :
                                <option>Loading...</option>
                            
                            }
                            </Input>
                        </Col>
                    </FormGroup>
                    {tipe == 'bulan' ?
                    <FormGroup row>
                        <Col md="4">
                            <Label>Bulan</Label>
                        </Col>
                        <Col md="8">
                            <Datetime 
                                dateFormat  = "MMMM YYYY"
                                timeFormat  = {false}
                                locale      = "id"
                                isValidDate = {valid}
                                onChange    = {(e) => setBulan(moment(e._d).format("YYYY-MM"))}
                            />
                            <Input 
                                innerRef = {register({
                                            required: true,
                                            })}
                                type     = "hidden"
                                name     = 'bulan'
                                invalid  = {errors.bulan && true}
                                value    = {bulan || ''}
                            />
                            <FormFeedback>{errors.bulan && getError(errors.bulan)}</FormFeedback>
                        </Col>
                    </FormGroup>
                    :
                    <>
                    <FormGroup row>
                        <Col md="4">
                            <Label>Tanggal Mulai</Label>
                        </Col>
                        <Col md="8">
                            <Datetime 
                                dateFormat = "dddd, DD MMMM YYYY"
                                timeFormat = {false}
                                locale     = "id"
                                isValidDate = {validStart}
                                onChange    = {(e) => setTglstart(moment(e._d).format("YYYY-MM-DD"))}
                            />
                            <Input 
                                innerRef = {register({
                                            required: true,
                                            })}
                                type     = "hidden"
                                name     = 'tgl_start'
                                invalid  = {errors.tgl_start && true}
                                value    = {tglstart || ''}
                            />
                            <FormFeedback>{errors.tgl_start && getError(errors.tgl_start)}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md="4">
                            <Label>Tanggal Selesai</Label>
                        </Col>
                        <Col md="8">
                            <Datetime 
                                dateFormat = "dddd, DD MMMM YYYY"
                                timeFormat = {false}
                                locale     = "id"
                                name       = 'tgl_finish'
                                onChange    = {(e) => setTglfinish(moment(e._d).format("YYYY-MM-DD"))}
                                isValidDate = {validFinish}
                            />
                            <Input 
                                innerRef = {register({
                                            required: true,
                                            })}
                                type     = "hidden"
                                name     = 'tgl_finish'
                                invalid  = {errors.tgl_finish && true}
                                value    = {tglfinish || ''}
                            />
                            <FormFeedback>{errors.tgl_finish && getError(errors.tgl_finish)}</FormFeedback>
                        </Col>
                    </FormGroup>
                    </>
                    }
                    <Col>
                        {props.submited ?
                            <Button className="pull-right" type="button"  size="sm" color="primary" disabled> <MetroSpinner size={16} color="#fff" /> </Button>
                            :
                            <Button className="pull-right" type="submit" size="sm" color="primary" disabled={props.submited}> <span><i className="fa fa-search"></i> Search</span> </Button> 
                        }
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}

export default class Default extends Component {
    constructor(props) {
      super(props);
      this.state = {
        optionCabang: null,
        submited    : false,
        data        : null,
        loading     : true,
        query       : "page=1&row=10",
        pageData    : false,
        params      : null,
        pageLoading : false,
        pageDetail  : false,
        dropDown: false
      }
    }
    
    componentDidMount(){
        this.getCabang();
    }
    getCabang(){
        axios.get(API().getOptionCabang + '?all=true', header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
                this.setState({optionCabang: res.data});
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

    columns = [
        {
          title   : '',
          field   : null,
          width   : 55,
          template: (row) => {
            return (<React.Fragment>
                      <Button onClick={() => this.doRead(row.id_mt)} title="Detail" className="btn-info btn-brand icon btn-sm">
                        <i style={{color:'#fff'}} className="cui-magnifying-glass"></i>
                      </Button>
                    </React.Fragment>
              )
          }
        },
        {
          title: 'Lokasi',
          field: 'nama_lokasi',
          width: 150,
        }, 
        {
          title: 'CCTV',
          field: 'kode_cctv',
          template: (row) =>{
            return row.kode_cctv + ' (' + row.nama_cctv + ')';
          }
        }, 
        {
         title: 'Waktu Incident',
         field: 'waktu_start',
         template: (row)=>{
           return moment(row.waktu_start).format("dddd, DD MMMM YYYY - HH:mm");
         }
        }, 
        {
         title: 'Waktu Selesai',
         field: 'waktu_finish',
         template: (row)=>{
          return moment(row.waktu_finish).format("dddd, DD MMMM YYYY - HH:mm");
        }
        }, 
        {
         title: 'User',
         field: 'finish_name',
         template: (row)=>{
           return row.finish_name;
         }
        }
    ];

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
    onSubmit(data, filter = false){
        if(!filter)
        this.setState({submited: true, pageData: false, params: data});
        let u = new URLSearchParams(this.state.params).toString();
        axios.get(API().getIncident + "?status=2&" + this.state.query + '&' + u, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
                this.setState({data: res.data, pageData: true, loading: false});
                if(!filter)
                this.setState({submited: false});
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
    handleRespone = data => {
        const { query } = data;
        if(query !== this.state.query){
            this.setState({query: query}, () => {
                this.onSubmit(this.state.params, true);
            });
        }
    }

    downloadReport(tipe=1){
        let u = new URLSearchParams(this.state.params).toString();
        const param = '?status=2&' +u;
        if(tipe==1){
            axios.get(API().exportReportInc + param, header(localStorage.getItem('token')))
            .then((response) => {
                window.open(response.data.path);
            }).catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: error.toString(),
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        }else{
            axios.get(API().exportLampiranInc + param, header(localStorage.getItem('token')))
            .then((response) => {
                window.open(response.data.path);
            }).catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: error.toString(),
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        }
    }
    render(){
        if(this.state.pageLoading){
            return (<MetroSpinner size={34} color="#fff" />)
        }
        if(this.state.pageDetail){
            return (<DetailMT
                    data   = {this.state.detailData}
                    goBack = {(value) => this.setState({pageDetail:false})}
                />)
        }
        return(
            <>
                <div className="animated fadeIn">
                    <Row>
                        <Col lg="6" md="8" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Filter</strong>
                                </CardHeader>
                                <CardBody>
                                    <Filter 
                                        optionCabang = {this.state.optionCabang}
                                        onSubmit     = {(data) => this.onSubmit(data)}
                                        submited     = {this.state.submited}
                                    />
                
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                {this.state.pageData ?
                <div className="animated fadeIn">
                    <Row>
                        <Col lg="12" md="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Report</strong>
                                    <div className="card-header-actions">
                                    <Dropdown isOpen={this.state.dropDown} toggle={() => {
                                        this.setState({dropDown: !this.state.dropDown});
                                    }}>
                                        <DropdownToggle caret>
                                            Download
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={()=> this.downloadReport(1)}><i style={{color:'#000000'}} className="fa fa-file-pdf-o"></i>1.C. Report</DropdownItem>
                                            <DropdownItem onClick={()=> this.downloadReport(2)}><i style={{color:'#000000'}} className="fa fa-file-pdf-o"></i>1.D. Lampiran</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <TableList
                                        data          = {this.state.data}
                                        columns       = {this.columns}
                                        loading       = {this.state.loading}
                                        handleRespone = {this.handleRespone}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                : null}
            </>
        )
    }
}