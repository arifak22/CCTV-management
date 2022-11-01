import React, { Component, useState  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup,Label, Input  } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm, SelectForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header, ServerUrl } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
import { Link } from 'react-router-dom';

function Add(props){
  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      id_cabang      : props.id_cabang,
    }
  });
  const [loading, setLoading] = useState(false)
  const onSubmit = data => {
    Swal.fire({
      title            : 'Apakah anda yakin ? ',
      icon             : 'info',
      text             : 'Menambah data ini ?',
      showCancelButton : true,
      focusConfirm     : false,
      confirmButtonText: 'Ya',
      cancelButtonText : 'Cancel',
    }).then((result)=>{
      if(result.value){
        setLoading(true);
        axios.post(API().postMasterLokasi, params(data), header(localStorage.getItem('token')))
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
              setLoading(false);
              reset({
                id_cabang      : props.id_cabang,
              });
              props.refreshData(true);
            }
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.toString(),
            icon: 'error',
            confirmButtonText: 'OK'
          });
          setLoading(false);
        });
      }
    })
  };
  return (
      <Row>
          <Col xs="12" sm="12" md="12">
              <Card>
                  <CardHeader>
                      <strong>Tambah Data</strong>
                      <div className="card-header-actions">
                        <Button onClick={()=> props.onClick()} block outline color="primary">
                          <i className="fa fa-remove"></i> 
                          {' '}<span>Hide</span>
                        </Button>
                      </div>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_cabang"
                        label  = "Cabang"
                        errors = {errors}
                        data   = {props.optionCabang}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 50, message: "50"},
                          })}
                        name   = "kode_lokasi"
                        label  = "Kode Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_lokasi"
                        label  = "Nama Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 50, message: "50"},
                          })}
                        name   = "alias"
                        label  = "Alias Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 200, message: "200"},
                          })}
                        name   = "koordinat"
                        label  = "Koordinat"
                        type   = "text"
                        errors = {errors}
                      />
                      <Button type="submit" size="sm" color="primary" disabled={loading}> {loading ? <MetroSpinner size={16} color="#fff" /> : <span><i className="fa fa-dot-circle-o"></i> Submit</span> }</Button>
                    </Form>
                  </CardBody>
              </Card>
          </Col>
      </Row>
  )
}

function Update(props){
  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      id_cabang  : props.data.id_cabang,
      kode_lokasi: props.data.kode_lokasi,
      nama_lokasi: props.data.nama_lokasi,
      alias      : props.data.alias_lokasi,
      koordinat  : props.data.koordinat,
    }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    Swal.fire({
      title            : 'Apakah anda yakin ? ',
      icon             : 'info',
      text             : 'Merubah data ini ?',
      showCancelButton : true,
      focusConfirm     : false,
      confirmButtonText: 'Ya',
      cancelButtonText : 'Cancel',
    }).then((result)=>{
      if(result.value){
        setLoading(true);
        axios.post(API().updateMasterLokasi, params(data), header(localStorage.getItem('token')))
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
              setLoading(false);
              reset();
              props.onClick();
              props.refreshData(true);
            }
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error.toString(),
            icon: 'error',
            confirmButtonText: 'OK'
          });
          setLoading(false);
        });
      }
    })
  };

  return (
      <Row>
          <Col xs="12" sm="12" md="12">
              <Card>
                  <CardHeader>
                      <strong>Ubah Data</strong>
                      <div className="card-header-actions">
                        <Button onClick={()=> props.onClick()} block outline color="primary">
                          <i className="fa fa-remove"></i> 
                          {' '}<span>Hide</span>
                        </Button>
                      </div>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <input ref={register()} type="hidden" name="id" value={props.data.id_lokasi}/>
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_cabang"
                        label  = "Cabang"
                        errors = {errors}
                        data   = {props.optionCabang}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 50, message: "50"},
                          })}
                        name   = "kode_lokasi"
                        label  = "Kode Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_lokasi"
                        label  = "Nama Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 50, message: "50"},
                          })}
                        name   = "alias"
                        label  = "Alias Lokasi"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 200, message: "200"},
                          })}
                        name   = "koordinat"
                        label  = "Koordinat"
                        type   = "text"
                        errors = {errors}
                      />
                      <Button type="submit" size="sm" color="primary" disabled={loading}> {loading ? <MetroSpinner size={16} color="#fff" /> : <span><i className="fa fa-dot-circle-o"></i> Ubah</span> }</Button>
                    </Form>
                  </CardBody>
              </Card>
          </Col>
      </Row>
  )
}

export default class Default extends Component {
  constructor(props) {
    super(props);
    this.state = { 
     data        : null,
     loading     : true,
     query       : "page=1&row=5",
     query_cabang: '',
     pageLoading : false,
     pageAdd     : false,
     pageUpdate  : false,
     dataUpdate  : null,
     optionCabang: null,
     id_cabang   : null,
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 90,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_lokasi)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_lokasi)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Kode Lokasi',
      field: 'kode_lokasi',
      width: 150,
    }, 
    {
      title: 'Nama Lokasi',
      field: 'nama_lokasi',
    }, 
    {
     title: 'Alias',
     field: 'alias_lokasi',
     width   : 150,
    }, 
    {
     title: 'Koordinat',
     field: 'koordinat',
     width   : 150,
    }
  ];

  componentDidMount(){
    // this.getData();
    this.getCabang();
  }

  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterLokasi + "?" + this.state.query + this.state.query_cabang, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        this.setState({data: res.data, loading: false});
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  getCabang(){
    axios.get(API().getOptionCabang, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionCabang: res.data, query_cabang: "&id_cabang=" + res.data[0].value, id_cabang:res.data[0].value}, () => {
            this.getData();
          });
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
        axios.post(API().deleteMasterLokasi, params({id: id}), header(localStorage.getItem('token')))
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

  doUpdate(id){
    window.scrollTo(0,0);
    this.setState({dataUpdate: null, pageUpdate: false, pageLoading: true, pageAdd: false});
    axios.get(API().getMasterLokasiBy + "?id="+id, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        this.setState({dataUpdate: res.data, pageUpdate: true, pageLoading: false});
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  handleChange(event){
    this.setState({id_cabang: event.target.value, query_cabang: "&id_cabang=" + event.target.value}, ()=>{
      this.getData();
    });
  }  

  render() {
    return (
      <React.Fragment>
        <Row style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
        {this.state.pageLoading ?
          <MetroSpinner size={34} color="#fff" />
          :
          null
        }
        </Row>
        {this.state.pageAdd ? 
        <Add
            onClick = {()=>this.setState({pageAdd: false})}
            refreshData = {(value) => this.getData()}
            optionCabang = {this.state.optionCabang}
            id_cabang = {this.state.id_cabang}
        />
        :
        null
        }
        {this.state.pageUpdate ? 
        <Update
            onClick     = {()=>this.setState({pageUpdate: false})}
            refreshData = {(value) => this.getData()}
            optionCabang = {this.state.optionCabang}
            data        = {this.state.dataUpdate}
        />
        :
        null
        }
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="12" md="12">
              <Card>
                <CardHeader>
                  <strong>Lokasi Cabang</strong>
                  <div className="card-header-actions">
                    {!this.state.pageAdd ?
                      <Button onClick={()=> this.setState({pageAdd: true, pageUpdate: false})} block outline color="primary">
                        <i className="fa fa-plus-circle"></i> 
                        {' '}<span>Tambah</span>
                      </Button>
                      :
                      null
                    }
                  </div>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="1">
                      <Label>Cabang</Label>
                    </Col>
                    <Col md="5">
                      <Input 
                          name     = "cabang"
                          type     = "select"
                          onChange = {(event) => this.handleChange(event)}
                      >
                          {this.state.optionCabang ? 
                          this.state.optionCabang.map((option, key) =>
                              <option key={key} value={option.value}>
                              {option.name}
                              </option>
                          )
                          :
                          <option>Loading...</option>
                        
                        }
                      </Input>
                    </Col>
                    <Col md="5">
                      <Link to="/master/cabang">
                        <Button title="Lihat Cabang" className="btn-info btn-brand icon">
                          <span style={{color: 'white'}}><i className="cui-list"></i></span>
                        </Button>
                      </Link>
                    </Col>
                  </FormGroup>
                  <hr/>
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
      </React.Fragment>
    );
  }
}