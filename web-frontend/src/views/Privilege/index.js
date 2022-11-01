import React, { Component, useState, useEffect  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
import { Link } from 'react-router-dom';

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
        axios.post(API().postMasterPrivilege, params(data), header(localStorage.getItem('token')))
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
                        name   = "nama"
                        label  = "Nama Privilege"
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
      nama: props.data.nama_privilege,
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
        axios.post(API().updateMasterPrivilege, params(data), header(localStorage.getItem('token')))
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
                      <input ref={register()} type="hidden" name="id" value={props.data.id_privilege}/>
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 100, message: "100"},
                          })}
                        name   = "nama"
                        label  = "Nama Privilege"
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
function Akses(props){
  const { register, handleSubmit, errors, reset } = useForm();
  const [list, setList]   = useState({status:true, data:[]});
  const [loading, setLoading] = useState(false);
  const [ready, setReady]     = useState(false);
  const onSubmit = data => {
    Swal.fire({
      title            : 'Apakah anda yakin ? ',
      icon             : 'info',
      text             : 'Menyimpan data ini ?',
      showCancelButton : true,
      focusConfirm     : false,
      confirmButtonText: 'Ya',
      cancelButtonText : 'Cancel',
    }).then((result)=>{
      if(result.value){
        setLoading(true);
        axios.post(API().postListPermission, params(data), header(localStorage.getItem('token')))
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
              // reset();
              // props.refreshData(true);
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
  function getList(privilege){
    setReady(true);
    axios.get(API().getListPermission + '?id_privilege=' + privilege, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          setList({status:list.status, data: res.data});
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
  function handleChange(e, all = false){
    let itemName = e.target.value;
    let checked = e.target.checked;
    setList(prevState => {
      let {status, data} = prevState;
      var newlist = data;
      var allChecked = true;
      if(all){
        for (let i = 0; i < data.length; i++) {
          newlist[i]['nama_menu'] = data[i]['nama_menu'];
          newlist[i]['id_menu']   = data[i]['id_menu'];
          newlist[i]['isChecked'] = data[i]['id_menu'] == itemName ? checked : data[i]['isChecked'];

          for (let j = 0; j < data[i].data.length; j++) {
            newlist[i]['data'][j]['id_sub_menu']   = data[i].data[j]['id_sub_menu'];
            newlist[i]['data'][j]['id_menu']       = data[i].data[j]['id_menu'];
            newlist[i]['data'][j]['nama_sub_menu'] = data[i].data[j]['nama_sub_menu'];
            newlist[i]['data'][j]['isChecked']     = data[i].data[j]['id_menu'] == itemName ? checked : data[i].data[j]['isChecked'];
          }
        }
      }else{
        for (let i = 0; i < data.length; i++) {
          newlist[i]['nama_menu'] = data[i]['nama_menu'];
          newlist[i]['id_menu']   = data[i]['id_menu'];
          for (let j = 0; j < data[i].data.length; j++) {
            newlist[i]['data'][j]['id_sub_menu']   = data[i].data[j]['id_sub_menu'];
            newlist[i]['data'][j]['id_menu']       = data[i].data[j]['id_menu'];
            newlist[i]['data'][j]['nama_sub_menu'] = data[i].data[j]['nama_sub_menu'];
            newlist[i]['data'][j]['isChecked']     = data[i].data[j]['id_sub_menu'] == itemName ? checked : data[i].data[j]['isChecked'];
            allChecked = newlist[i]['data'][j]['isChecked'] * allChecked;
          }
          newlist[i]['isChecked']   = allChecked;
          allChecked = true;
        }
      }
      status = !status;
      data = newlist;
      return {status, data};
    });
  }
  useEffect(() => {
    if(!ready){
      getList(props.dataAkses.id_privilege);
    }
  }, [list]);
  return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader>
                <strong>Permission (Privilege: {props.dataAkses.nama_privilege})</strong>
                <div className="card-header-actions">
                <Button onClick={()=> props.pageAkses(false)} color="warning">
                      <i className="cui-chevron-left"></i> 
                      {' '}<span>Back</span>
                    </Button>
                </div>
              </CardHeader>
              <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input ref={register()} type="hidden" name="id" value={props.dataAkses.id_privilege}/>
                  <Row>
                    {list.data.map((item, index) => (
                    <Col key={index} xs="12" sm="6" md="4">
                      <Card>
                        <CardHeader>
                          <FormGroup check className="checkbox">
                            <Input onChange = {(event) => handleChange(event, true)} checked={item.isChecked} className="form-check-input" type="checkbox" name="checkall" value={item.id_menu} />
                            <Label check className="form-check-label">{item.nama_menu}</Label>
                          </FormGroup>
                        </CardHeader>
                        <CardBody>
                        <FormGroup row>
                          <Col md="12">
                          {item.data.map((value, key) => (
                            <FormGroup key={key} check className="checkbox">
                              <Input onChange = {(event) => handleChange(event)} checked={value.isChecked} className="form-check-input" innerRef = {register()} type="checkbox" name="submenu" value={value.id_sub_menu} />
                              <Label check className="form-check-label">{value.nama_sub_menu}</Label>
                            </FormGroup>
                          ))}
                          </Col>
                        </FormGroup>
                        </CardBody>
                      </Card>
                    </Col>
                    ))}
                  </Row>
                  <Button type="submit" size="sm" color="primary" disabled={loading}> {loading ? <MetroSpinner size={16} color="#fff" /> : <span><i className="fa fa-dot-circle-o"></i> Submit</span> }</Button>

                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
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
     pageAkses  : false,
     dataAkses  : null,
     optionMenu: null
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 120,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_privilege)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_privilege)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doAkses(row.id_privilege)} title="Akses Menu" className="btn-success btn-brand icon btn-sm">
                    <i className="fa fa-sitemap"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Nama Privilege',
      field: 'nama_privilege',
    },
  ];

  componentDidMount(){
    this.getData();
    this.getMenu();
  }

  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterPrivilege + "?" + this.state.query, header(localStorage.getItem('token')))
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
  getMenu(){
    axios.get(API().getOptionMenu, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          this.setState({optionMenu: res.data});
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
  doAkses(id){
    window.scrollTo(0,0);
    this.setState({pageLoading: true, dataAkses: null});
    axios.get(API().getMasterPrivilegeBy + "?id="+id, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result)
        this.setState({pageAkses: true, dataAkses: res.data, pageLoading: false});
    }).catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.toString(),
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
        axios.post(API().deleteMasterPrivilege, params({id: id}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterPrivilegeBy + "?id="+id, header(localStorage.getItem('token')))
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
    if(this.state.pageAkses){
      return (
        <React.Fragment>
          <Akses
            pageAkses    = {(value) => this.setState({pageAkses: value})}
            optionMenu = {this.state.optionMenu}
            dataAkses    = {this.state.dataAkses}
          />
        </React.Fragment>
      )
    }
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
                  <strong>Privilege</strong>
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