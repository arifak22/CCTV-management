import React, { Component, useState, useEffect  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup,Label, Input, Table  } from 'reactstrap';
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
  const { register, handleSubmit, errors, reset } = useForm();
  const defaultLokasi         = [{value:'',name:'Loading...'}];
  const [loading, setLoading] = useState(false);
  const [ready, setReady]     = useState(false);
  const [lokasi, setLokasi]   = useState(defaultLokasi);
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
        axios.post(API().postMasterCctv, params(data), header(localStorage.getItem('token')))
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
  var optionCabang = props.optionCabang.filter(function(value, index, arr){
    return value.value !== '';
  });
  var optionTiang = props.optionTiang.filter(function(value, index, arr){
    return value.value !== '';
  });
  var optionMerk = props.optionMerk.filter(function(value, index, arr){
    return value.value !== '';
  });
  
  function getLokasi(cabang){
      setReady(true);
      setLokasi(defaultLokasi);
      axios.get(API().getOptionLokasi + '?id_cabang=' + cabang, header(localStorage.getItem('token')))
      .then((response) => {
          let res = response.data;
          let result = SwalResult(res);
          if(result){
            setLokasi(res.data);
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
  useEffect(() => {
    if(!ready){
      getLokasi(optionCabang[0].value);
    }
  }, [lokasi]);
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
                      <Row>
                        <Col sm="6">
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_cabang"
                            label    = "Cabang"
                            errors   = {errors}
                            data     = {optionCabang}
                            onChange = {(event)=> getLokasi(event.target.value)}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_lokasi"
                            label    = "Lokasi"
                            errors   = {errors}
                            data     = {lokasi}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 15, message: "15"},
                              })}
                            name   = "kode_cctv"
                            label  = "Kode CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 200, message: "200"},
                              })}
                            name   = "nama_cctv"
                            label  = "Nama CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 15, message: "15"},
                                minLength: {value: 7, message: "7"},
                                pattern: {value:/((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'Format IP Address tidak sesuai.'}
                              })}
                            name   = "ip_address"
                            label  = "IP Address"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 50, message: "50"},
                              })}
                            name   = "type"
                            label  = "Tipe CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                        </Col>
                        <Col sm="6">
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "status"
                            label    = "Status"
                            errors   = {errors}
                            data     = {[{value: 1,name: 'Aktif'}, {value:0, name:'Tidak Aktif'}]}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_tipe_tiang"
                            label    = "Tipe Tiang"
                            errors   = {errors}
                            data     = {optionTiang}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_merk"
                            label    = "Merk"
                            errors   = {errors}
                            data     = {optionMerk}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 100, message: "100"},
                              })}
                            name   = "username"
                            label  = "Username"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 100, message: "100"},
                              })}
                            name   = "password"
                            label  = "Password"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 250, message: "250"},
                              })}
                            name   = "keterangan"
                            label  = "Keterangan"
                            type   = "textarea"
                            errors = {errors}
                          />
                        </Col>
                        <Col sm="12">
                        <FormGroup row>
                          <Col md="12">
                          <Label>Akses CCTV</Label>
                          {props.optionPerusahaan.map((value, key) => (
                            <FormGroup key={key} check className="checkbox">
                              <Input className="form-check-input" innerRef = {register()} type="checkbox" name="perusahaan" value={value.value} />
                              <Label check className="form-check-label">{value.name}</Label>
                            </FormGroup>
                          ))}
                          </Col>
                        </FormGroup>
                        </Col>
                      </Row>
                      <Button type="submit" size="sm" color="primary" disabled={loading}> {loading ? <MetroSpinner size={16} color="#fff" /> : <span><i className="fa fa-dot-circle-o"></i> Submit</span> }</Button>
                    </Form>
                  </CardBody>
              </Card>
          </Col>
      </Row>
  )
}

function Update(props){
  const { register, handleSubmit, errors, setValue , reset } = useForm({
    defaultValues: {
      id_cabang    : props.data.id_cabang,
      kode_cctv    : props.data.kode_cctv,
      nama_cctv    : props.data.nama_cctv,
      ip_address   : props.data.ip,
      type         : props.data.type,
      status       : props.data.status,
      id_tipe_tiang: props.data.id_tipe_tiang,
      id_merk      : props.data.id_merk,
      username     : props.data.username,
      password     : props.data.password,
      keterangan   : props.data.keterangan,
    }
  });
  const defaultLokasi         = [{value:'',name:'Loading...'}];
  const [loading, setLoading] = useState(false);
  const [ready, setReady]     = useState(false);
  const [lokasi, setLokasi]   = useState(defaultLokasi);
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
        axios.post(API().updateMasterCctv, params(data), header(localStorage.getItem('token')))
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
  var optionCabang = props.optionCabang.filter(function(value, index, arr){
    return value.value !== '';
  });
  var optionTiang = props.optionTiang.filter(function(value, index, arr){
    return value.value !== '';
  });
  var optionMerk = props.optionMerk.filter(function(value, index, arr){
    return value.value !== '';
  });
  
  function getLokasi(cabang, value = null){
      setReady(true);
      setLokasi(defaultLokasi);
      axios.get(API().getOptionLokasi + '?id_cabang=' + cabang, header(localStorage.getItem('token')))
      .then((response) => {
          let res = response.data;
          let result = SwalResult(res);
          if(result){
            setLokasi(res.data);
            if(value)
            setValue('id_lokasi', value);
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
  useEffect(() => {
    if(!ready){
      getLokasi(props.data.id_cabang, props.data.id_lokasi);
    }
  }, [lokasi]);
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
                    <input ref={register()} type="hidden" name="id" value={props.data.id_cctv}/>

                      <Row>
                        <Col sm="6">
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_cabang"
                            label    = "Cabang"
                            errors   = {errors}
                            data     = {optionCabang}
                            onChange = {(event)=> getLokasi(event.target.value)}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_lokasi"
                            label    = "Lokasi"
                            errors   = {errors}
                            data     = {lokasi}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 15, message: "15"},
                              })}
                            name   = "kode_cctv"
                            label  = "Kode CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 200, message: "200"},
                              })}
                            name   = "nama_cctv"
                            label  = "Nama CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 15, message: "15"},
                                minLength: {value: 7, message: "7"},
                                pattern: {value:/((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'Format IP Address tidak sesuai.'}
                              })}
                            name   = "ip_address"
                            label  = "IP Address"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 50, message: "50"},
                              })}
                            name   = "type"
                            label  = "Tipe CCTV"
                            type   = "text"
                            errors = {errors}
                          />
                        </Col>
                        <Col sm="6">
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "status"
                            label    = "Status"
                            errors   = {errors}
                            data     = {[{value: 1,name: 'Aktif'}, {value:0, name:'Tidak Aktif'}]}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_tipe_tiang"
                            label    = "Tipe Tiang"
                            errors   = {errors}
                            data     = {optionTiang}
                          />
                          <SelectForm 
                            refs={register({
                                required: true,
                              })}
                            name     = "id_merk"
                            label    = "Merk"
                            errors   = {errors}
                            data     = {optionMerk}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 100, message: "100"},
                              })}
                            name   = "username"
                            label  = "Username"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 100, message: "100"},
                              })}
                            name   = "password"
                            label  = "Password"
                            type   = "text"
                            errors = {errors}
                          />
                          <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 250, message: "250"},
                              })}
                            name   = "keterangan"
                            label  = "Keterangan"
                            type   = "textarea"
                            errors = {errors}
                          />
                        </Col>
                      </Row>
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
     data         : null,
     loading      : true,
     query        : "page=1&row=5",
     query_cabang : '',
     query_lokasi : '',
     query_tiang  : '',
     query_merk   : '',
     detailData   : null,
     pageDetail   : false,
     pageLoading  : false,
     pageAdd      : false,
     pageUpdate   : false,
     dataUpdate   : null,
     optionCabang : null,
     id_cabang    : null,
     optionLokasi : null,
     id_lokasi    : null,
     optionTiang  : null,
     id_tipe_tiang: null,
     optionMerk   : null,
     code_merk    : null,
     hide         : false,
     optionPerusahaan: null,
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 120,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_cctv)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_cctv)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doRead(row.id_cctv)} title="Detail" className="btn-info btn-brand icon btn-sm">
                    <i style={{color:'#fff'}} className="cui-magnifying-glass"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Kode CCTV',
      field: 'kode_cctv',
    }, 
    {
      title: 'Nama CCTV',
      field: 'nama_cctv',
    }, 
    {
     title: 'IP Address',
     field: 'ip',
    },
    {
     title: 'Lokasi',
     field: 'nama_lokasi',
    }, 
    {
     title: 'Tipe Tiang',
     field: 'nama_tipe',
    }, 
  ];

  componentDidMount(){
    this.getCabang();
    this.getTiang();
    this.getMerk();
    this.getPerusahaan();
  }

  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterCctv + "?" + this.state.query + this.state.query_cabang + this.state.query_lokasi + this.state.query_tiang + this.state.query_merk  , header(localStorage.getItem('token')))
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

  getPerusahaan(){
    axios.get(API().getOptionPerusahaan, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionPerusahaan: res.data});
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

  getCabang(){
    axios.get(API().getOptionCabang + '?all=true', header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionCabang: res.data, query_cabang: "&id_cabang=" + res.data[0].value, id_cabang:res.data[0].value}, () => {
            this.getLokasi();
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

  getLokasi(){
    axios.get(API().getOptionLokasi + '?all=true' + this.state.query_cabang, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionLokasi: res.data, query_lokasi: "&id_lokasi=" + res.data[0].value, id_lokasi:res.data[0].value}, () => {
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

  getTiang(){
    axios.get(API().getOptionTiang + '?all=true', header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionTiang: res.data, query_tiang: "&id_tipe_tiang=" + res.data[0].value, id_tipe_tiang:res.data[0].value}, () => {
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

  getMerk(){
    axios.get(API().getOptionMerk + '?all=true', header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionMerk: res.data, query_merk: "&code_merk=" + res.data[0].value, code_merk:res.data[0].value}, () => {
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
        axios.post(API().deleteMasterCctv, params({id: id}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterCctvBy + "?id="+id, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        // console.log(res.data);
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

  doRead(id){
    this.setState({pageLoading: true});
    axios.get(API().detailMasterCctv + "?id="+id, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        // console.log(res.data);
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

  handleLokasi(event){
    this.setState({id_lokasi: event.target.value, query_lokasi: "&id_lokasi=" + event.target.value}, ()=>{
      this.getData();
    });
  }  
  handleCabang(event){
    this.setState({id_cabang: event.target.value, query_cabang: "&id_cabang=" + event.target.value}, ()=>{
      this.getLokasi();
    });
  }  
  handleTiang(event){
    this.setState({id_tipe_tiang: event.target.value, query_tiang: "&id_tipe_tiang=" + event.target.value}, ()=>{
      this.getData();
    });
  } 
  handleMerk(event){
    this.setState({code_merk: event.target.value, query_merk: "&code_merk=" + event.target.value}, ()=>{
      this.getData();
    });
  }  
  valueDetail(label, value){
    return(<tr>
      <td width={250}>{label}</td>
      <td width={5}>:</td>
      <td>{value}</td>
    </tr>);
  }
  render() {
    return (
      <React.Fragment>
      <div style={{display: this.state.pageDetail ? 'inline' : 'none'}}>
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="12" md="12">
              <Card>
                <CardHeader>
                  <strong>Detail</strong>
                  <div className="card-header-actions">
                      <Button onClick={()=> this.setState({pageDetail: false})} color="warning">
                        <i className="cui-chevron-left"></i> 
                        {' '}<span>Back</span>
                      </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {this.state.detailData ?
                  <Table hover bordered striped responsive>
                    <tbody>
                      {this.valueDetail('Kode CCTV', this.state.detailData.kode_cctv)}
                      {this.valueDetail('Nama CCTV', this.state.detailData.nama_cctv)}
                      {this.valueDetail('IP Address', this.state.detailData.ip)}
                      {this.valueDetail('Tipe CCTV', this.state.detailData.type)}
                      {this.valueDetail('Status', this.state.detailData.status === '1' ? 'Aktif' : 'Tidak Aktif')}
                      {this.valueDetail('Lokasi CCTV', this.state.detailData.nama_lokasi)}
                      {this.valueDetail('Tipe Tiang', this.state.detailData.nama_tipe)}
                      {this.valueDetail('Merk', this.state.detailData.nama_merk)}
                      {this.valueDetail('Username', this.state.detailData.username)}
                      {this.valueDetail('Password', this.state.detailData.password)}
                      {this.valueDetail('Keterangan', this.state.detailData.keterangan)}
                    </tbody>
                  </Table>
                  :
                  null
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div style={{display: !this.state.pageDetail ? 'inline' : 'none'}}>
        <Row style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
        {this.state.pageLoading ?
          <MetroSpinner size={34} color="#fff" />
          :
          null
        }
        </Row>
        {this.state.pageAdd ? 
        <Add
            onClick          = {()=>this.setState({pageAdd: false})}
            refreshData      = {(value) => this.getData()}
            optionCabang     = {this.state.optionCabang}
            optionTiang      = {this.state.optionTiang}
            optionMerk       = {this.state.optionMerk}
            optionPerusahaan = {this.state.optionPerusahaan}
        />
        :
        null
        }
        {this.state.pageUpdate ? 
        <Update
            onClick     = {()=>this.setState({pageUpdate: false})}
            refreshData = {(value) => this.getData()}
            optionCabang = {this.state.optionCabang}
            optionTiang  = {this.state.optionTiang}
            optionMerk   = {this.state.optionMerk}
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
                  <strong>CCTV</strong>
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
                  {this.state.hide ? null :
                  <React.Fragment>
                    <FormGroup row>
                      <Col md="1">
                        <Label>Cabang</Label>
                      </Col>
                      <Col md="5">
                        <Input 
                            name     = "cabang"
                            type     = "select"
                            onChange = {(event) => this.handleCabang(event)}
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
                    <FormGroup row>
                      <Col md="1">
                        <Label>Lokasi</Label>
                      </Col>
                      <Col md="5">
                        <Input 
                            name     = "lokasi"
                            type     = "select"
                            onChange = {(event) => this.handleLokasi(event)}
                        >
                            {this.state.optionLokasi ? 
                            this.state.optionLokasi.map((option, key) =>
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
                        <Link to="/master/lokasi">
                          <Button title="Lihat Lokasi" className="btn-info btn-brand icon">
                            <span style={{color: 'white'}}><i className="cui-list"></i></span>
                          </Button>
                        </Link>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="1">
                        <Label>Tiang</Label>
                      </Col>
                      <Col md="5">
                        <Input 
                            name     = "tiang"
                            type     = "select"
                            onChange = {(event) => this.handleTiang(event)}
                        >
                            {this.state.optionTiang ? 
                            this.state.optionTiang.map((option, key) =>
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
                        <Link to="/master/tiang">
                          <Button title="Lihat Tiang" className="btn-info btn-brand icon">
                            <span style={{color: 'white'}}><i className="cui-list"></i></span>
                          </Button>
                        </Link>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col md="1">
                      <Label>Merk</Label>
                    </Col>
                    <Col md="5">
                      <Input 
                          name     = "merk"
                          type     = "select"
                          onChange = {(event) => this.handleMerk(event)}
                      >
                          {this.state.optionMerk ? 
                          this.state.optionMerk.map((option, key) =>
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
                    </Col>
                  </FormGroup>
                  </React.Fragment>
                  }
                  <hr style={{marginBottom:0}}/>
                  <span onClick={()=> this.setState({hide: !this.state.hide})} style={{color:'blue', cursor:'pointer'}}>[ {!this.state.hide ? 'Hide' : 'Show Filter' } ]</span>
                  <br/>
                  <br/>
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
      </div>
      </React.Fragment>
    );
  }
}