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
      id_menu      : props.id_menu,
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
        axios.post(API().postMasterSubmenu, params(data), header(localStorage.getItem('token')))
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
                id_menu      : props.id_menu,
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
                        name   = "id_menu"
                        label  = "Nama menu"
                        errors = {errors}
                        data   = {props.optionMenu}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_sub_menu"
                        label  = "Nama Sub menu"
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
                            required : true,
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
      id_menu      : props.data.id_menu,
      nama_sub_menu: props.data.nama_sub_menu,
      urutan       : props.data.urutan,
      link         : props.data.link,
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
        axios.post(API().updateMasterSubmenu, params(data), header(localStorage.getItem('token')))
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
                      <input ref={register()} type="hidden" name="id" value={props.data.id_sub_menu}/>
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "id_menu"
                        label  = "Nama menu"
                        errors = {errors}
                        data   = {props.optionMenu}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama_sub_menu"
                        label  = "Nama Sub menu"
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
                            required : true,
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
     data        : null,
     loading     : true,
     query       : "page=1&row=5",
     query_menu: '',
     pageLoading : false,
     pageAdd     : false,
     pageUpdate  : false,
     dataUpdate  : null,
     optionMenu: null,
     id_menu   : null,
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 90,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_sub_menu)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_sub_menu)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Nama Sub Menu',
      field: 'nama_sub_menu',
      width: 150,
    }, 
    {
      title: 'Urutan',
      field: 'urutan',
    }, 
    {
     title: 'Link',
     field: 'link',
     width   : 150,
    },
  ];

  componentDidMount(){
    // this.getData();
    this.getMenu();
  }

  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterSubmenu + "?" + this.state.query + this.state.query_menu, header(localStorage.getItem('token')))
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

  getMenu(){
    axios.get(API().getOptionMenu, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionMenu: res.data, query_menu: "&id_menu=" + res.data[0].value, id_menu:res.data[0].value}, () => {
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
        axios.post(API().deleteMasterSubmenu, params({id: id}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterSubmenuBy + "?id="+id, header(localStorage.getItem('token')))
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
    this.setState({id_menu: event.target.value, query_menu: "&id_menu=" + event.target.value}, ()=>{
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
            onClick     = {()=>this.setState({pageAdd: false})}
            refreshData = {(value) => this.getData()}
            optionMenu  = {this.state.optionMenu}
            id_menu     = {this.state.id_menu}
        />
        :
        null
        }
        {this.state.pageUpdate ? 
        <Update
            onClick     = {()=>this.setState({pageUpdate: false})}
            refreshData = {(value) => this.getData()}
            optionMenu  = {this.state.optionMenu}
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
                  <strong>Sub Menu</strong>
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
                      <Label>Menu</Label>
                    </Col>
                    <Col md="5">
                      <Input 
                          name     = "menu"
                          type     = "select"
                          onChange = {(event) => this.handleChange(event)}
                      >
                          {this.state.optionMenu ? 
                          this.state.optionMenu.map((option, key) =>
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
                      <Link to="/master/menu">
                        <Button title="Lihat Menu" className="btn-info btn-brand icon">
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