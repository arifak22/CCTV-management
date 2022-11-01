import React, { Component, useState, useEffect  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm, SelectForm } from '../../Component/FormComponent';
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
        axios.post(API().postMasterPerusahaan, params(data), header(localStorage.getItem('token')))
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

  const intern = [{value: 'Y', name:'Ya'},{value: 'N', name:'Tidak'}];

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
                            maxLength: {value: 200, message: "200"},
                          })}
                        name   = "nama"
                        label  = "Nama Perusahaan"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 20, message: "20"},
                          })}
                        name   = "alias"
                        label  = "Alias"
                        type   = "text"
                        errors = {errors}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "intern"
                        label  = "Perusahaan Intern"
                        errors = {errors}
                        data   = {intern}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 2000, message: "2000"},
                          })}
                        name   = "keterangan"
                        label  = "Keterangan"
                        type   = "textarea"
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
      nama      : props.data.nama_perusahaan,
      alias     : props.data.alias,
      intern    : props.data.intern,
      keterangan: props.data.keterangan,
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
        axios.post(API().updateMasterPerusahaan, params(data), header(localStorage.getItem('token')))
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
  const intern = [{value: 'Y', name:'Ya'},{value: 'N', name:'Tidak'}];

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
                      <input ref={register()} type="hidden" name="id" value={props.data.id_perusahaan}/>
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 200, message: "200"},
                          })}
                        name   = "nama"
                        label  = "Nama Perusahaan"
                        type   = "text"
                        errors = {errors}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 20, message: "20"},
                          })}
                        name   = "alias"
                        label  = "Alias"
                        type   = "text"
                        errors = {errors}
                      />
                      <SelectForm 
                        refs={register({
                            required : true,
                          })}
                        name   = "intern"
                        label  = "Perusahaan Intern"
                        errors = {errors}
                        data   = {intern}
                      />
                      <InputForm 
                        refs={register({
                            required : true,
                            maxLength: {value: 2000, message: "2000"},
                          })}
                        name   = "keterangan"
                        label  = "Keterangan"
                        type   = "textarea"
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
        axios.post(API().postListAksesCctv, params(data), header(localStorage.getItem('token')))
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
  function getList(cabang, perusahaan){
    setReady(true);
    axios.get(API().getListAksesCctv + '?id_cabang=' + cabang + '&id_perusahaan=' + perusahaan, header(localStorage.getItem('token')))
    .then((response) => {
        let res = response.data;
        let result = SwalResult(res);
        if(result){
          setList({status:list.status, data: res.data});
          console.log(list)
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
  function handleCabang(e, perusahaan){
    let itemName = e.target.value;
    getList(itemName, perusahaan);
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
          newlist[i]['nama_lokasi'] = data[i]['nama_lokasi'];
          newlist[i]['id_lokasi']   = data[i]['id_lokasi'];
          newlist[i]['isChecked']   = data[i]['id_lokasi'] == itemName ? checked : data[i]['isChecked'];

          for (let j = 0; j < data[i].data.length; j++) {
            newlist[i]['data'][j]['id_cctv']   = data[i].data[j]['id_cctv'];
            newlist[i]['data'][j]['id_lokasi'] = data[i].data[j]['id_lokasi'];
            newlist[i]['data'][j]['kode_cctv'] = data[i].data[j]['kode_cctv'];
            newlist[i]['data'][j]['nama_cctv'] = data[i].data[j]['nama_cctv'];
            newlist[i]['data'][j]['isChecked'] = data[i].data[j]['id_lokasi'] == itemName ? checked : data[i].data[j]['isChecked'];
          }
        }
      }else{
        for (let i = 0; i < data.length; i++) {
          newlist[i]['nama_lokasi'] = data[i]['nama_lokasi'];
          newlist[i]['id_lokasi']   = data[i]['id_lokasi'];
          for (let j = 0; j < data[i].data.length; j++) {
            newlist[i]['data'][j]['id_cctv']   = data[i].data[j]['id_cctv'];
            newlist[i]['data'][j]['id_lokasi'] = data[i].data[j]['id_lokasi'];
            newlist[i]['data'][j]['kode_cctv'] = data[i].data[j]['kode_cctv'];
            newlist[i]['data'][j]['nama_cctv'] = data[i].data[j]['nama_cctv'];
            newlist[i]['data'][j]['isChecked'] = data[i].data[j]['id_cctv'] == itemName ? checked : data[i].data[j]['isChecked'];
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
      getList(props.optionCabang[0].value, props.dataAkses.id_perusahaan);
    }
  }, [list]);
  return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader>
                <strong>Akses CCTV (Perusahaan: {props.dataAkses.nama_perusahaan})</strong>
                <div className="card-header-actions">
                <Button onClick={()=> props.pageAkses(false)} color="warning">
                      <i className="cui-chevron-left"></i> 
                      {' '}<span>Back</span>
                    </Button>
                </div>
              </CardHeader>
              <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input ref={register()} type="hidden" name="id" value={props.dataAkses.id_perusahaan}/>
                <FormGroup row>
                  <Col md="1">
                    <Label>Cabang</Label>
                  </Col>
                  <Col md="5">
                    <Input 
                        name     = "cabang"
                        type     = "select"
                        innerRef = {register()}
                        onChange = {(event) => handleCabang(event, props.dataAkses.id_perusahaan)}
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
                  <Col md="5">
                    <Link to="/master/cabang">
                      <Button title="Lihat Cabang" className="btn-info btn-brand icon">
                        <span style={{color: 'white'}}><i className="cui-list"></i></span>
                      </Button>
                    </Link>
                  </Col>
                </FormGroup>
                <hr/>
                  <Row>
                    {list.data.map((item, index) => (
                    <Col key={index} xs="12" sm="6" md="4">
                      <Card>
                        <CardHeader>
                          <FormGroup check className="checkbox">
                            <Input onChange = {(event) => handleChange(event, true)} checked={item.isChecked} className="form-check-input" type="checkbox" name="checkall" value={item.id_lokasi} />
                            <Label check className="form-check-label">{item.nama_lokasi}</Label>
                          </FormGroup>
                        </CardHeader>
                        <CardBody>
                        <FormGroup row>
                          <Col md="12">
                          {item.data.map((value, key) => (
                            <FormGroup key={key} check className="checkbox">
                              <Input onChange = {(event) => handleChange(event)} checked={value.isChecked} className="form-check-input" innerRef = {register()} type="checkbox" name="cctv" value={value.id_cctv} />
                              <Label check className="form-check-label">{value.kode_cctv + ' (' + value.nama_cctv + ')'}</Label>
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
    };
    
  }

  columns = [
    {
      title   : '',
      field   : null,
      width   : 120,
      template: (row) => {
        return (<React.Fragment>
                  <Button onClick={() => this.doDelete(row.id_perusahaan)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                    <i className="cui-trash"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doUpdate(row.id_perusahaan)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                    <i className="cui-pencil"></i>
                  </Button> {'   '}
                  <Button onClick={() => this.doAkses(row.id_perusahaan)} title="Akses CCTV" className="btn-success btn-brand icon btn-sm">
                    <i className="fa fa-sitemap"></i>
                  </Button>
                </React.Fragment>
          )
      }
    },
    {
      title: 'Nama Perusahaan',
      field: 'nama_perusahaan',
    }, 
    {
     title: 'Alias',
     field: 'alias',
     width   : 200,
    }, 
    {
     title: 'Intern',
     field: 'intern',
     width   : 80,
     template: (row) => {
         if(row.intern === 'Y'){
             return 'Ya';
         }else{
             return 'Tidak';
         }
     }
    }, 
    {
     title: 'Keterangan',
     field: 'keterangan',
     width   : 350,
    }
  ];

  componentDidMount(){
    this.getData();
    this.getCabang();
  }

  doAkses(id){
    window.scrollTo(0,0);
    this.setState({pageLoading: true, dataAkses: null});
    axios.get(API().getMasterPerusahaanBy + "?id="+id, header(localStorage.getItem('token')))
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
  getData(){
    this.setState({loading: true});
    axios.get(API().getMasterPerusahaan + "?" + this.state.query, header(localStorage.getItem('token')))
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
        axios.post(API().deleteMasterPerusahaan, params({id: id}), header(localStorage.getItem('token')))
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
    axios.get(API().getMasterPerusahaanBy + "?id="+id, header(localStorage.getItem('token')))
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

  getCabang(){
    axios.get(API().getOptionCabang, header(localStorage.getItem('token')))
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

  

  render() {
    if(this.state.pageAkses){
      return (
        <React.Fragment>
          <Akses
            pageAkses    = {(value) => this.setState({pageAkses: value})}
            optionCabang = {this.state.optionCabang}
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
                  <strong>Perusahaan</strong>
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