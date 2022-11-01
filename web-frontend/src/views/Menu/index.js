import React, { Component, useState  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";

function Add(props){
  const { register, handleSubmit, errors, reset } = useForm();
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
        axios.post(API().postMasterMenu, params(data), header(localStorage.getItem('token')))
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
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_menu"
                        label  = "Nama Menu"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "ikon"
                        label  = "Ikon"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            min: {value: 1, message: "1"},
                            max: {value: 50, message: "50"},
                          })}
                        name   = "urutan"
                        label  = "Urutan"
                        errors = {errors}
                        type   = "number"
                      />
                      <InputForm 
                        refs={register({
                            required : false,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "link"
                        label  = "Link"
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
      nama_menu: props.data.nama_menu,
      ikon     : props.data.ikon,
      urutan   : props.data.urutan,
      link     : props.data.link
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
        axios.post(API().updateMasterMenu, params(data), header(localStorage.getItem('token')))
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
                      <input ref={register()} type="hidden" name="id" value={props.data.id_menu}/>
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_menu"
                        label  = "Nama Menu"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "ikon"
                        label  = "Ikon"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            min: {value: 1, message: "1"},
                            max: {value: 50, message: "50"},
                          })}
                        name   = "urutan"
                        label  = "Urutan"
                        errors = {errors}
                        type   = "number"
                      />
                      <InputForm 
                        refs={register({
                            required : false,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "link"
                        label  = "Link"
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
     data       : null,
     loading    : true,
     query      : "page=1&row=5",
     pageLoading: false,
     pageAdd    : false,
     pageUpdate : false,
     dataUpdate : null,
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 90,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_menu)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_menu)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Nama Menu',
      field: 'nama_menu',
    }, 
    {
      title: 'Ikon',
      field: 'ikon',
      template: (row)=>{
        return(<i className={row.ikon}></i>);
      }
    }, 
    {
     title: 'Urutan',
     field: 'urutan',
     width   : 150,
    }, 
    {
     title: 'Link',
     field: 'link',
     width   : 150,
    }
  ];

  componentDidMount(){
    this.getData();
  }

  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterMenu + "?" + this.state.query, header(localStorage.getItem('token')))
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
        axios.post(API().deleteMasterMenu, params({id: id}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterMenuBy + "?id="+id, header(localStorage.getItem('token')))
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
        />
        :
        null
        }
        {this.state.pageUpdate ? 
        <Update
            onClick     = {()=>this.setState({pageUpdate: false})}
            refreshData = {(value) => this.getData()}
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
                  <strong>Menu</strong>
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