import React, { Component, useState  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup,Label, Input, Table  } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm, SelectForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header, Assets } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
import { Link } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';

function Add(props){
  const { register, handleSubmit, errors, reset } = useForm();
  const [loading, setLoading] = useState(false)
  const [fileFoto, setFileFoto] = useState(null)
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
        var formData = new FormData();
        for ( var key in data ) {
          if(key === 'foto'){
            // formData.append(key, data[key][0]);
          }else{
            formData.append(key, data[key]);
          }
        }  
        formData.append('foto', fileFoto);

        axios.post(API().postMasterUser, formData, header(localStorage.getItem('token'), 'multipart/form-data'))
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
  var optionPerusahaan = props.optionPerusahaan.filter(function(value, index, arr){
    return value.value !== '';
  });
  const fileChangedHandler = event => {
    var fileInput = false
    if(event.target.files[0]) {
        fileInput = true
    }
    if(fileInput) {
        Resizer.imageFileResizer(
            event.target.files[0],
            1200,
            1200,
            'JPEG',
            100,
            0,
            uri => { setFileFoto(uri) },
            'blob'
        );
    }
  }
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
                      <InputForm 
                        refs={register({
                            required : true,
                            minLength: {value: 6, message: "6"},
                            maxLength: {value: 25, message: "25"},
                            pattern  : {value:/^[0-9a-z_.-]+$/, message:"Hanya Huruf dan angka"}
                          })}
                        name   = "username"
                        label  = "Username"
                        type   = "text"
                        errors = {errors}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_perusahaan"
                        label  = "Perusahaan"
                        errors = {errors}
                        data   = {optionPerusahaan}
                      />
                      <SelectForm 
                        refs={register()}
                        name   = "id_cabang"
                        label  = "Cabang"
                        errors = {errors}
                        data   = {props.optionCabang}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_privilege"
                        label  = "Privilege"
                        errors = {errors}
                        data   = {props.optionPriv}
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
                            maxLength: {value: 255, message: "255"},
                          })}
                        name   = "nama"
                        label  = "Nama Lengkap"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            maxLength: {value: 255, message: "255"},
                            pattern  : {value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, message:'Format E-mail salah. (ex: example@example.com)'}
                          })}
                        name   = "email_address"
                        label  = "E-Mail"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            maxLength: {value: 255, message: "255"},
                          })}
                        name   = "keterangan"
                        label  = "Keterangan"
                        type   = "textarea"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register()}
                        name   = "foto"
                        label  = "Foto"
                        type   = "file"
                        errors = {errors}
                        onChange={(event) => fileChangedHandler(event)}
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
      id_perusahaan: props.data.id_perusahaan,
      id_cabang    : props.data.id_cabang,
      id_privilege : props.data.id_privilege,
      username     : props.data.username,
      nama         : props.data.nama,
      email_address: props.data.email_address,
      keterangan   : props.data.keterangan,
    }
  });
  const [loading, setLoading] = useState(false)
  const [fileFoto, setFileFoto] = useState(null)
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

        var formData = new FormData();
        for ( var key in data ) {
          if(key === 'foto'){
            // formData.append(key, data[key][0]);
          }else{
            formData.append(key, data[key]);
          }
        }  
        formData.append('foto', fileFoto);
        formData.append('username', props.data.username);

        axios.post(API().updateMasterUser, formData, header(localStorage.getItem('token'), 'multipart/form-data'))
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
  var optionPerusahaan = props.optionPerusahaan.filter(function(value, index, arr){
    return value.value !== '';
  });
  const fileChangedHandler = event => {
    var fileInput = false
    if(event.target.files[0]) {
        fileInput = true
    }
    if(fileInput) {
        Resizer.imageFileResizer(
            event.target.files[0],
            1200,
            1200,
            'JPEG',
            100,
            0,
            uri => { setFileFoto(uri) },
            'blob'
        );
    }
  }
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
                      <input ref={register()} type="hidden" name="id" value={props.data.id}/>
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 25, message: "25"},
                            minLength: {value: 6, message: "6"},
                            pattern  : {value:/^[0-9a-z_.-]+$/, message:"Hanya Huruf dan angka"}
                          })}
                        name   = "username"
                        label  = "Username"
                        type   = "text"
                        errors = {errors}
                        disabled = {true}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_perusahaan"
                        label  = "Perusahaan"
                        errors = {errors}
                        data   = {optionPerusahaan}
                      />
                      <SelectForm 
                        refs={register()}
                        name   = "id_cabang"
                        label  = "Cabang"
                        errors = {errors}
                        data   = {props.optionCabang}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_privilege"
                        label  = "Privilege"
                        errors = {errors}
                        data   = {props.optionPriv}
                      />
                      
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 255, message: "255"},
                          })}
                        name   = "nama"
                        label  = "Nama Lengkap"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            maxLength: {value: 255, message: "255"},
                            pattern  : {value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, message:'Format E-mail salah. (ex: example@example.com)'}
                          })}
                        name   = "email_address"
                        label  = "E-Mail"
                        type   = "text"
                        errors = {errors}
                      />
                       <InputForm 
                        refs={register({
                            maxLength: {value: 255, message: "255"},
                          })}
                        name   = "keterangan"
                        label  = "Keterangan"
                        type   = "textarea"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register()}
                        name   = "foto"
                        label  = "Foto"
                        type   = "file"
                        errors = {errors}
                        onChange={(event) => fileChangedHandler(event)}
                      />
                      <InputForm 
                        refs={register({
                            required : false,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "password"
                        label  = "Reset Password"
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

function Updateold(props){
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
     data            : null,
     loading         : true,
     query           : "page=1&row=5",
     query_perusahaan: '',
     pageLoading     : false,
     pageAdd         : false,
     pageDetail      : false,
     detailData      : null,
     pageUpdate      : false,
     dataUpdate      : null,
     optionPerusahaan: null,
     optionCabang    : null,
     optionPriv      : null,
     id_perusahaan   : null,
     imageHash       : Date.now()
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 120,
      template: (row) => {
        var changeStatus =  <Button onClick={() => this.doStatus(row.id, 0)} title="Banned" className="btn-danger btn-brand icon btn-sm">
                              <i className="cui-ban"></i>
                            </Button>;
        if(row.status === '0'){
          changeStatus =  <Button onClick={() => this.doStatus(row.id, 1)} title="Active" className="btn-success btn-brand icon btn-sm">
                            <i className="cui-check"></i>
                          </Button>
        }
        return (<React.Fragment>
                  {changeStatus} {'   '}
                  <Button onClick={() => this.doUpdate(row.id)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button>{'   '}
                  <Button onClick={() => this.doRead(row.id)} title="Detail" className="btn-info btn-brand icon btn-sm">
                    <i style={{color:'#fff'}} className="cui-magnifying-glass"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Username',
      field: 'username',
    }, 
    {
      title: 'Status',
      field: 'status',
      width: 80,
      template: (row) =>{
        if(row.status === '1'){
          return (<span className="badge badge-success">Aktif</span>)
        }else{
          return (<span className="badge badge-danger">Banned</span>)
        }
      }
    },
    {
      title: 'Nama',
      field: 'nama',
    }, 
    {
     title: 'Perusahaan',
     field: 'nama_perusahaan',
    }, 
    {
     title: 'Privilege',
     field: 'nama_privilege',
    }
  ];

  componentDidMount(){
    // this.getData();
    this.getPerusahaan();
    this.getCabang();
    this.getPrivilege();
  }

  getData(){
    this.setState({loading: true, imageHash:  Date.now()});
    axios.get(API().getMasterUser + "?" + this.state.query + this.state.query_perusahaan, header(localStorage.getItem('token')))
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
    axios.get(API().getOptionPerusahaan+ '?all=true', header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionPerusahaan: res.data, query_perusahaan: "&id_perusahaan=" + res.data[0].value, id_perusahaan:res.data[0].value}, () => {
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

  getPrivilege(){
    axios.get(API().getOptionPriv, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionPriv: res.data});
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

  doStatus(id, status){
    var text = 'Banned user ini ?';
    if(status === 1){
      text = 'Active user ini ?';
    }
    Swal.fire({
      title            : 'Apakah anda yakin ? ',
      icon             : 'info',
      text             : text,
      showCancelButton : true,
      focusConfirm     : false,
      confirmButtonText: 'Ya',
      cancelButtonText : 'Cancel',
    }).then((result)=>{
      if(result.value){
        SwalLoading();
        axios.post(API().statusMasterUser, params({id: id, status: status}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterUserBy + "?id="+id, header(localStorage.getItem('token')))
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

  doRead(id){
    this.setState({pageLoading: true});
    axios.get(API().detailMasterUser + "?id="+id, header(localStorage.getItem('token')))
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

  handleChange(event){
    this.setState({id_perusahaan: event.target.value, query_perusahaan: "&id_perusahaan=" + event.target.value}, ()=>{
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
                        <tr>
                          <td width={250}>Foto</td>
                          <td width={5}>:</td>
                          <td><img style={{maxHeight:'150px'}} src={Assets(this.state.detailData.foto + '?hash=' + this.state.imageHash)}/></td>
                        </tr>
                        {this.valueDetail('Username', this.state.detailData.username)}
                        {this.valueDetail('Nama Lengkap', this.state.detailData.nama)}
                        {this.valueDetail('Status', this.state.detailData.status === '1' ? 'Aktif' : 'Tidak Aktif')}
                        {this.valueDetail('Privilege', this.state.detailData.nama_privilege)}
                        {this.valueDetail('Cabang', this.state.detailData.nama_cabang)}
                        {this.valueDetail('Perusahaan', this.state.detailData.nama_perusahaan)}
                        {this.valueDetail('E-mail', this.state.detailData.email_address)}
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
            onClick = {()=>this.setState({pageAdd: false})}
            refreshData = {(value) => this.getData()}
            optionPerusahaan = {this.state.optionPerusahaan}
            optionCabang = {this.state.optionCabang}
            optionPriv = {this.state.optionPriv}
            id_perusahaan = {this.state.id_perusahaan}
        />
        :
        null
        }
        {this.state.pageUpdate ? 
        <Update
            onClick     = {()=>this.setState({pageUpdate: false})}
            refreshData = {(value) => this.getData()}
            optionPerusahaan = {this.state.optionPerusahaan}
            optionCabang = {this.state.optionCabang}
            optionPriv = {this.state.optionPriv}
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
                  <strong>User</strong>
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
                      <Label>Perusahaan</Label>
                    </Col>
                    <Col md="5">
                      <Input 
                          name     = "perusahaan"
                          type     = "select"
                          onChange = {(event) => this.handleChange(event)}
                      >
                          {this.state.optionPerusahaan ? 
                          this.state.optionPerusahaan.map((option, key) =>
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
                      <Link to="/master/perusahaan">
                        <Button title="Lihat Perusahaan" className="btn-info btn-brand icon">
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
        </div>
      </React.Fragment>
    );
  }
}