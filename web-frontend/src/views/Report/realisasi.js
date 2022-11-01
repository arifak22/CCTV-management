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
import DetailMT from '../Maintenance/detail';
import Datetime from 'react-datetime';
import RealisasiTable from './tableRealisasi';

import 'moment/locale/id';
var moment = require('moment');
var fileDownload = require('js-file-download');
function Filter(props){
    const { register, handleSubmit, errors, reset } = useForm();
    const [bulan, setBulan]         = useState(null);
    const onSubmit = data => props.onSubmit(data);
    
    var now = Date.now();
    var valid = function( current ){
        return current.isBefore( now );
    };
    return(
        <Row>
            <Col>
                <Form onSubmit={handleSubmit(onSubmit)}>
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
        isProses    : false,
        lastday     : 31,
        dropDown    : false
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
    onSubmit(data, filter = false){
        if(!filter)
        this.setState({submited: true, pageData: false, params: data});
        let u = new URLSearchParams(this.state.params).toString();
        axios.get(API().getRealisasi + '?' + u, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
                this.setState({data: res.data, lastday: res.lastday, pageData: true, loading: false});
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

    refreshReport(){
        this.setState({isProses : true});
        Swal.fire({
            title: 'Wait',
            html: "Mohon ditunggu...",
            showConfirmButton: false,
            customClass: 'sweetalert-xs',
            allowOutsideClick: false,
        })
        axios.post(API().postProsesRealisasi, params(this.state.params), header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            this.setState({isProses : false})
            if(result){
              Swal.fire({
                title            : 'Sukses!',
                text             : res.api_message,
                icon             : 'success',
                confirmButtonText: 'OK',
              }).then((value)=>{
                  this.onSubmit(this.state.params)
              });
            }
        })
        .catch((error) => {
        this.setState({isProses : false})
        Swal.fire({
            title: 'Error!',
            text: error.toString(),
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }

    downloadReport(tipe=1){
        this.setState({isProses : true});
        Swal.fire({
            title: 'Wait',
            html: "Mohon ditunggu...",
            showConfirmButton: false,
            customClass: 'sweetalert-xs',
            allowOutsideClick: false,
        })
        let u = new URLSearchParams(this.state.params).toString();
        axios.get(API().getExcelRealisasi + '?' + u, header(localStorage.getItem('token')))
        .then((response) => {
            Swal.close();
            this.setState({isProses : false})
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

    render(){
        if(this.state.pageLoading){
            return (<MetroSpinner size={34} color="#fff" />)
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
                        {this.state.pageData ?
                        <Col lg="6" md="8" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Keterangan</strong>
                                </CardHeader>
                                <CardBody>
                                    <i className="nav-icon fa fa-circle text-danger"></i> : {' '} Rusak<br/>
                                    <i className="nav-icon fa fa-circle text-warning"></i> : {' '} Incident<br/>
                                    <i className="nav-icon fa fa-circle text-success"></i> : {' '} Maintenance<br/>
                                    <i className="nav-icon fa fa-circle text-purple"></i> : {' '} Incident {'&'} Maintenance<br/>
                                </CardBody>
                            </Card>
                        </Col> : null }
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
                                        <Row>
                                            <button disabled={this.state.isProses} onClick={()=> this.refreshReport()} className="btn-brand mr-1 mb-1 btn btn-warning">
                                                <i className="fa fa-refresh"></i><span>Refresh</span>
                                            </button>
                                            
                                            <button disabled={this.state.isProses} onClick={()=> this.downloadReport()} className="btn-brand mr-1 mb-1 btn btn-success">
                                                <i className="fa fa-file-excel-o"></i><span>Download</span>
                                            </button> {' '}
                                        </Row>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <RealisasiTable
                                        data    = {this.state.data}
                                        lastday = {this.state.lastday}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                : null
                }
            </>
        )
    }
}