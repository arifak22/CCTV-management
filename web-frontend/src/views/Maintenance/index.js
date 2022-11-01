import React, { Component, useState, useEffect  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input, Table, FormFeedback,Nav, NavItem, NavLink, TabContent, TabPane, Badge } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { SelectForm, DateForm, FileForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading, makeid } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
import Resizer from 'react-image-file-resizer';
import TableList from '../../Component/TableComponent';
import DetailMT from './detail';
import 'moment/locale/id';

var moment = require('moment');

  function Add(props){
      const { register, handleSubmit, errors, reset } = useForm();
      const defaultValue                = [{value:'',name:'Loading...'}];
      const [loading, setLoading]       = useState(false);
      const [ready, setReady]           = useState(false);
      const [lokasi, setLokasi]         = useState(defaultValue);
      const [cctv, setCctv]             = useState(defaultValue);
      const [foto, setFoto]             = useState([]);
      const [temp, setTemp]             = useState(null);
      const [view, setView]             = useState('select');
      const [FotoBefore, setFotoBefore] = useState(null);
      const [FotoAfter, setFotoAfter]   = useState(null);

      const addFoto = (uri) => {
        setTemp(uri);
        var datatoPush = {
          id  : makeid(6),
          use : false,
          file: uri
        }
        foto.push(datatoPush);
        setFoto(foto);
        setTemp(null);

      }
      const hapus = (id) =>{
        var newFoto = [];
        setTemp(id);
        for (let index = 0; index < foto.length; index++) {
          if(foto[index].id !== id){
            newFoto.push(foto[index]);
          }
        }
        setFoto(newFoto);
        setTemp(null);
      }
      const check = (id) =>{
        var newFoto = [];
        var newTemp = null;
        var i = 0;
        setTemp(id);
        for (let index = 0; index < foto.length; index++) {
          if(foto[index].id === id){
            newTemp = {
              id  : id,
              use : !foto[index].use,
              file: foto[index].file
            }
            if(!foto[index].use)
            i = i+1;
            newFoto.push(newTemp);
          }else{
            if(foto[index].use)
            i = i+1;
            newFoto.push(foto[index]);
          }
        }
        var lastFoto = [];
        if(i > 2){
          var ready = true;
          for (let index = 0; index < newFoto.length; index++) {
            if(newFoto[index].use === true && newFoto[index].id !== id && ready){
              newTemp = {
                id  : newFoto[index].id,
                use : false,
                file: newFoto[index].file
              }
              ready = false;
              lastFoto.push(newTemp);
            }else{
              lastFoto.push(newFoto[index]);
            }
          }
          setFoto(lastFoto);
        }else{
          setFoto(newFoto);
        }
        setTemp(null);
      }
      const fileChangedHandler = event => {
          if(event.target.files[0]){
              var ext = event.target.files[0].type.split('/')[0];
              if(ext !== 'image'){
                  Swal.fire({
                      title            : 'Error!',
                      text             : 'Hanya File Gambar',
                      icon             : 'error',
                      confirmButtonText: 'OK',
                  })
                  setTemp(null)
              }else{
                  var fileInput = false
                  if(event.target.files[0]) {
                      fileInput = true
                  }
                  if(fileInput) {
                      Resizer.imageFileResizer(
                          event.target.files[0],
                          600,
                          600,
                          'PNG',
                          100,
                          0,
                          uri => { addFoto(uri) },
                          'base64'
                      );
                  }
                  event.target.value = null;
              }
          }else{
            setTemp(null)
          }
      }

      const onDraft = data => {
        Swal.fire({
          title            : 'Apakah anda yakin ? ',
          icon             : 'info',
          text             : 'Menyimpan ke Draft ?',
          showCancelButton : true,
          focusConfirm     : false,
          confirmButtonText: 'Ya',
          cancelButtonText : 'Cancel',
        }).then((result)=>{
          if(result.value){
            executeSubmit(data, 0);
          }
        })
      }
      const onSubmit = data => {
        Swal.fire({
          title            : 'Apakah anda yakin ? ',
          icon             : 'info',
          text             : 'Menyelesaikan data ini ?',
          showCancelButton : true,
          focusConfirm     : false,
          confirmButtonText: 'Ya',
          cancelButtonText : 'Cancel',
        }).then((result)=>{
          if(result.value){
            executeSubmit(data, 1);
          }
        })
      };
      const executeSubmit = (data, status) =>{
        setLoading(true);
        var formData = new FormData();
        for ( var key in data ) {
          formData.append(key, data[key]);
        }  
        formData.append('foto', JSON.stringify(foto));
        formData.append('status', status);
        axios.post(API().postMaintenance, formData, header(localStorage.getItem('token'), 'multipart/form-data'))
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
              props.onClick();
              props.refreshData(true);

            }else{
              setLoading(false);
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
      

      function getLokasi(cabang){
          setReady(true);
          setLokasi(defaultValue);
          axios.get(API().getOptionLokasi + '?id_cabang=' + cabang, header(localStorage.getItem('token')))
          .then((response) => {
              let res = response.data;
              let result = SwalResult(res);
              if(result){
                setLokasi(res.data);
                getCctv(res.data[0].value);
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

      function getCctv(lokasi){
          setCctv(defaultValue);
          axios.get(API().getOptionCctv + '?id_lokasi=' + lokasi, header(localStorage.getItem('token')))
          .then((response) => {
              let res = response.data;
              let result = SwalResult(res);
              if(result){
                setCctv(res.data);
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
          getLokasi(props.optionCabang[0].value);
        }
      }, [lokasi]);

      const cekReady = () =>{
        var count = 0;
        for (let index = 0; index < foto.length; index++) {
          if(foto[index].use === true)
          count = count+1;
        }
        if(count !== 2)
        return true;
        if(FotoBefore === null)
        return true;
        if(FotoAfter === null)
        return true;
        
        return false;
      }

      const viewChange = (e) =>{
        setView(e);
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
                          <Row>
                            <Col md="6">
                              <SelectForm 
                                  refs={register({
                                      required: true,
                                      })}
                                  name     = "id_cabang"
                                  label    = "Cabang"
                                  errors   = {errors}
                                  data     = {props.optionCabang}
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
                                  onChange = {(event)=> getCctv(event.target.value)}
                              />
                              <SelectForm 
                                  refs={register({
                                      required: true,
                                      })}
                                  name     = "id_cctv"
                                  label    = "CCTV"
                                  errors   = {errors}
                                  data     = {cctv}
                              />
                            </Col>
                            <Col md="6">
                              <DateForm 
                                  refs={register({
                                      required : true,
                                      })}
                                  name   = "waktu"
                                  label  = "Waktu"
                                  errors = {errors}
                              />
                              <FormGroup row>
                                <Col md="3">
                                  <Label>Kegiatan</Label>
                                </Col>
                                <Col md="9">
                                  <FormGroup check inline>
                                    <Input innerRef = {register()} className="form-check-input" onChange={(e) => viewChange(e.target.value)} type="radio" name="view_kegiatan" value="select" checked = {view === 'select' ? true: false}/>
                                    <Label className="form-check-label" check>select</Label>
                                  </FormGroup>
                                  <FormGroup check inline>
                                    <Input innerRef = {register()} className="form-check-input" onChange={(e) =>viewChange(e.target.value)} type="radio" name="view_kegiatan" value="text"  checked = {view === 'text' ? true: false}/>
                                    <Label className="form-check-label" check>text</Label>
                                  </FormGroup>
                                </Col>
                                <Col md="12">
                                    <div style={{display: view === 'select' ? 'block' : 'none'}}>
                                      <Input 
                                          name     = "kegiatan_select"
                                          innerRef = {register()}
                                          invalid  = {errors.kegiatan_select && true}
                                          type     ="select"
                                      >
                                          {props.optionKegiatan.map((option, key) =>
                                              <option key={key} value={option.value}>
                                              {option.name}
                                              </option>
                                          )}
                                      </Input>
                                      <FormFeedback>{errors.kegiatan_select && errors.kegiatan_select.message}</FormFeedback>
                                    </div>
                                    <div style={{display: view === 'text' ? 'block' : 'none'}}>
                                      <Input 
                                          name     = "kegiatan_text"
                                          innerRef = {register()}
                                          invalid  = {errors.kegiatan_text && true}
                                          type     = "text"
                                      />
                                      <FormFeedback>{errors.kegiatan_text && errors.kegiatan_text.message}</FormFeedback>
                                    </div>

                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <hr/>
                          <Row>
                            <Col md="12">
                                <Label>Foto View CCTV</Label>
                            </Col>
                            <Col md="6">
                              <FileForm 
                                  refs     = {register()}
                                  name     = "foto_before"
                                  label    = "Foto Before"
                                  onChange = {(event, uri) => setFotoBefore(uri)}
                                  type     = "file"
                                  errors   = {errors}
                              />
                            </Col>
                            <Col md="6">
                              <FileForm 
                                  refs     = {register()}
                                  name     = "foto_after"
                                  label    = "Foto After"
                                  type     = "file"
                                  onChange = {(event, uri) => setFotoAfter(uri)}
                                  errors   = {errors}
                              />
                            </Col>
                          </Row>
                          <hr/>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <Label>Foto Kegiatan</Label>
                                <Row>
                                  <Col md="3">
                                    <Input 
                                        name     = "foto"
                                        type     = "file"
                                        accept   = "image/*"
                                        onChange = {(event) => fileChangedHandler(event)}
                                      />
                                  </Col>
                                </Row>
                              </FormGroup>
                              <Table responsive bordered>
                                <thead>
                                  <tr>
                                    <th width="80px">Hapus</th>
                                    <th width="80px">Use</th>
                                    <th>Foto</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {foto.length > 0 ? foto.slice(0).reverse().map((value, key) => (
                                    <tr key={key}>
                                      <td style={{verticalAlign:'middle'}} align="center">
                                        <Button title="Hapus" onClick={() => hapus(value.id)} className="btn-danger btn-brand icon btn-sm">
                                          <i className="cui-trash"></i>
                                        </Button>
                                      </td>
                                      <td style={{verticalAlign:'middle'}} align="center">
                                        <FormGroup check className="checkbox">
                                          <Input checked={value.use} onChange={() => check(value.id)}  className="form-check-input" type="checkbox" name="foto_kegiatan" />
                                          <Label check className="form-check-label">{' '}</Label>
                                        </FormGroup>
                                      </td>
                                      <td>
                                        <img height="250px" src={value.file}/>
                                      </td>
                                    </tr>
                                  )) : <tr><td align="center" colSpan="3">---- Kosong ----</td></tr>}
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
                          {loading ? 
                          <Button type="button"  size="sm" color="primary" disabled> <MetroSpinner size={16} color="#fff" /> </Button>
                          :
                          <>
                          <Button type="button" onClick={handleSubmit(onDraft)} size="sm" color="primary" disabled={loading}> <span><i className="fa fa-dot-circle-o"></i> Draft</span> </Button> 
                          {'    '}
                          <Button type="submit" size="sm" color="primary" disabled={cekReady() || loading}><span><i className="fa fa-dot-circle-o"></i> Simpan</span> </Button>
                          </>
                          }
                        </Form>
                      </CardBody>
                  </Card>
              </Col>
          </Row>
      )
  }
  function Update(props){
    const { register, handleSubmit, errors, setValue } = useForm({
      defaultValues: {
        id_cabang      : props.data.id_cabang,
        waktu          : props.data.waktu,
        kegiatan_select: props.data.kegiatan,
      }
    });
    const defaultValue                = [{value:'',name:'Loading...'}];
    const [loading, setLoading]       = useState(false);
    const [ready, setReady]           = useState(false);
    const [lokasi, setLokasi]         = useState(defaultValue);
    const [cctv, setCctv]             = useState(defaultValue);
    const [foto, setFoto]             = useState(props.foto);
    const [temp, setTemp]             = useState(null);
    const [view, setView]             = useState('select');
    const [FotoBefore, setFotoBefore] = useState(props.data.foto_before);
    const [FotoAfter, setFotoAfter]   = useState(props.data.foto_after);

    const addFoto = (uri) => {
      setTemp(uri);
      var datatoPush = {
        id  : makeid(6),
        use : false,
        file: uri
      }
      foto.push(datatoPush);
      setFoto(foto);
      setTemp(null);

    }
    const hapus = (id) =>{
      var newFoto = [];
      setTemp(id);
      for (let index = 0; index < foto.length; index++) {
        if(foto[index].id !== id){
          newFoto.push(foto[index]);
        }
      }
      setFoto(newFoto);
      setTemp(null);
    }
    const check = (id) =>{
      var newFoto = [];
      var newTemp = null;
      var i = 0;
      setTemp(id);
      for (let index = 0; index < foto.length; index++) {
        if(foto[index].id === id){
          newTemp = {
            id  : id,
            use : !foto[index].use,
            file: foto[index].file
          }
          if(!foto[index].use)
          i = i+1;
          newFoto.push(newTemp);
        }else{
          if(foto[index].use)
          i = i+1;
          newFoto.push(foto[index]);
        }
      }
      var lastFoto = [];
      if(i > 2){
        var ready = true;
        for (let index = 0; index < newFoto.length; index++) {
          if(newFoto[index].use === true && newFoto[index].id !== id && ready){
            newTemp = {
              id  : newFoto[index].id,
              use : false,
              file: newFoto[index].file
            }
            ready = false;
            lastFoto.push(newTemp);
          }else{
            lastFoto.push(newFoto[index]);
          }
        }
        setFoto(lastFoto);
      }else{
        setFoto(newFoto);
      }
      setTemp(null);
    }
    const fileChangedHandler = event => {
        if(event.target.files[0]){
            var ext = event.target.files[0].type.split('/')[0];
            if(ext !== 'image'){
                Swal.fire({
                    title            : 'Error!',
                    text             : 'Hanya File Gambar',
                    icon             : 'error',
                    confirmButtonText: 'OK',
                })
                setTemp(null)
            }else{
                var fileInput = false
                if(event.target.files[0]) {
                    fileInput = true
                }
                if(fileInput) {
                    Resizer.imageFileResizer(
                        event.target.files[0],
                        600,
                        600,
                        'PNG',
                        100,
                        0,
                        uri => { addFoto(uri) },
                        'base64'
                    );
                }
                event.target.value = null;
            }
        }else{
          setTemp(null)
        }
    }

    const onDraft = data => {
      Swal.fire({
        title            : 'Apakah anda yakin ? ',
        icon             : 'info',
        text             : 'Menyimpan ke Draft ?',
        showCancelButton : true,
        focusConfirm     : false,
        confirmButtonText: 'Ya',
        cancelButtonText : 'Cancel',
      }).then((result)=>{
        if(result.value){
          executeSubmit(data, 0);
        }
      })
    }
    const onSubmit = data => {
      Swal.fire({
        title            : 'Apakah anda yakin ? ',
        icon             : 'info',
        text             : 'Menyelesaikan data ini ?',
        showCancelButton : true,
        focusConfirm     : false,
        confirmButtonText: 'Ya',
        cancelButtonText : 'Cancel',
      }).then((result)=>{
        if(result.value){
          executeSubmit(data, 1);
        }
      })
    };
    const executeSubmit = (data, status) =>{
      setLoading(true);
      var formData = new FormData();
      for ( var key in data ) {
        formData.append(key, data[key]);
      }  
      formData.append('foto', JSON.stringify(foto));
      formData.append('status', status);
      axios.post(API().updateMaintenance, formData, header(localStorage.getItem('token'), 'multipart/form-data'))
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
            props.onClick();
            props.refreshData(true);

          }else{
            setLoading(false);
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
    

    function getLokasi(cabang, value= null, value2= null){
        setReady(true);
        setLokasi(defaultValue);
        axios.get(API().getOptionLokasi + '?id_cabang=' + cabang, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
              setLokasi(res.data);
              if(value){
                setValue('id_lokasi', value);
                getCctv(value, value2);
              }else{
                getCctv(res.data[0].value);
              }

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

    function getCctv(lokasi, value=null){
        setCctv(defaultValue);
        axios.get(API().getOptionCctv + '?id_lokasi=' + lokasi, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
              setCctv(res.data);
              if(value)
              setValue('id_cctv', value);
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
        getLokasi(props.data.id_cabang, props.data.id_lokasi, props.data.id_cctv);
      }
    }, [lokasi]);

    const cekReady = () =>{
      var count = 0;
      for (let index = 0; index < foto.length; index++) {
        if(foto[index].use === true)
        count = count+1;
      }
      if(count !== 2)
      return true;
      if(FotoBefore === null)
      return true;
      if(FotoAfter === null)
      return true;
      
      return false;
    }

    const viewChange = (e) =>{
      setView(e);
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
                        <input ref={register()} type="hidden" name="id" value={props.data.id_mt}/>
                        <Row>
                          <Col md="6">
                            <SelectForm 
                                refs={register({
                                    required: true,
                                    })}
                                name     = "id_cabang"
                                label    = "Cabang"
                                errors   = {errors}
                                data     = {props.optionCabang}
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
                                onChange = {(event)=> getCctv(event.target.value)}
                            />
                            <SelectForm 
                                refs={register({
                                    required: true,
                                    })}
                                name     = "id_cctv"
                                label    = "CCTV"
                                errors   = {errors}
                                data     = {cctv}
                            />
                          </Col>
                          <Col md="6">
                            <DateForm 
                                refs={register({
                                    required: true,
                                    })}
                                name   = "waktu"
                                label  = "Waktu"
                                errors = {errors}
                                value  = {props.data.waktu}
                            />
                            <FormGroup row>
                              <Col md="3">
                                <Label>Kegiatan</Label>
                              </Col>
                              <Col md="9">
                                <FormGroup check inline>
                                  <Input innerRef = {register()} className="form-check-input" onChange={(e) => viewChange(e.target.value)} type="radio" name="view_kegiatan" value="select" checked = {view === 'select' ? true: false}/>
                                  <Label className="form-check-label" check>select</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input innerRef = {register()} className="form-check-input" onChange={(e) =>viewChange(e.target.value)} type="radio" name="view_kegiatan" value="text"  checked = {view === 'text' ? true: false}/>
                                  <Label className="form-check-label" check>text</Label>
                                </FormGroup>
                              </Col>
                              <Col md="12">
                                  <div style={{display: view === 'select' ? 'block' : 'none'}}>
                                    <Input 
                                        name     = "kegiatan_select"
                                        innerRef = {register()}
                                        invalid  = {errors.kegiatan_select && true}
                                        type     ="select"
                                    >
                                        {props.optionKegiatan.map((option, key) =>
                                            <option key={key} value={option.value}>
                                            {option.name}
                                            </option>
                                        )}
                                    </Input>
                                    <FormFeedback>{errors.kegiatan_select && errors.kegiatan_select.message}</FormFeedback>
                                  </div>
                                  <div style={{display: view === 'text' ? 'block' : 'none'}}>
                                    <Input 
                                        name     = "kegiatan_text"
                                        innerRef = {register()}
                                        invalid  = {errors.kegiatan_text && true}
                                        type     = "text"
                                    />
                                    <FormFeedback>{errors.kegiatan_text && errors.kegiatan_text.message}</FormFeedback>
                                  </div>

                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col md="12">
                              <Label>Foto View CCTV</Label>
                          </Col>
                          <Col md="6">
                            <FileForm 
                                refs     = {register()}
                                name     = "foto_before"
                                label    = "Foto Before"
                                onChange = {(event, uri) => setFotoBefore(uri)}
                                type     = "file"
                                errors   = {errors}
                                value    = {FotoBefore}
                            />
                          </Col>
                          <Col md="6">
                            <FileForm 
                                refs     = {register()}
                                name     = "foto_after"
                                label    = "Foto After"
                                type     = "file"
                                onChange = {(event, uri) => setFotoAfter(uri)}
                                errors   = {errors}
                                value    = {FotoAfter}
                            />
                          </Col>
                        </Row>
                        <hr/>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <Label>Foto Kegiatan</Label>
                              <Row>
                                <Col md="3">
                                  <Input 
                                      name     = "foto"
                                      type     = "file"
                                      accept   = "image/*"
                                      onChange = {(event) => fileChangedHandler(event)}
                                    />
                                </Col>
                              </Row>
                            </FormGroup>
                            <Table responsive bordered>
                              <thead>
                                <tr>
                                  <th width="80px">Hapus</th>
                                  <th width="80px">Use</th>
                                  <th>Foto</th>
                                </tr>
                              </thead>
                              <tbody>
                                {foto.length > 0 ? foto.slice(0).reverse().map((value, key) => (
                                  <tr key={key}>
                                    <td style={{verticalAlign:'middle'}} align="center">
                                      <Button title="Hapus" onClick={() => hapus(value.id)} className="btn-danger btn-brand icon btn-sm">
                                        <i className="cui-trash"></i>
                                      </Button>
                                    </td>
                                    <td style={{verticalAlign:'middle'}} align="center">
                                      <FormGroup check className="checkbox">
                                        <Input checked={value.use} onChange={() => check(value.id)}  className="form-check-input" type="checkbox" name="foto_kegiatan" />
                                        <Label check className="form-check-label">{' '}</Label>
                                      </FormGroup>
                                    </td>
                                    <td>
                                      <img height="250px" src={value.file}/>
                                    </td>
                                  </tr>
                                )) : <tr><td align="center" colSpan="3">---- Kosong ----</td></tr>}
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                        {loading ? 
                        <Button type="button"  size="sm" color="primary" disabled> <MetroSpinner size={16} color="#fff" /> </Button>
                        :
                        <>
                        <Button type="button" onClick={handleSubmit(onDraft)} size="sm" color="primary" disabled={loading}> <span><i className="fa fa-dot-circle-o"></i> Draft</span> </Button> 
                        {'    '}
                        <Button type="submit" size="sm" color="primary" disabled={cekReady() || loading}><span><i className="fa fa-dot-circle-o"></i> Simpan</span> </Button>
                        </>
                        }
                      </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
  }
  class DraftList extends Component {
    constructor(props) {
      super(props);
      this.state = { 
       data        : null,
       loading     : true,
       query       : "page=1&row=10",
      }
    }
    componentDidMount(){
      this.getData();
      this.props.total(null);
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
          axios.post(API().deleteMaintenance, params({id: id}), header(localStorage.getItem('token')))
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
    columns = [
      {
        title   : '',
        field   : null,
        width   : 120,
        template: (row) => {
          return (<React.Fragment>
                    <Button onClick={() => this.doDelete(row.id_mt)} title="Hapus" className="btn-danger btn-brand icon btn-sm">
                      <i className="cui-trash"></i>
                    </Button> {'   '}
                    <Button onClick={() => this.props.doUpdate(row.id_mt)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                      <i className="cui-pencil"></i>
                    </Button> {'   '}
                    <Button onClick={() => this.props.doRead(row.id_mt)} title="Detail" className="btn-info btn-brand icon btn-sm">
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
       title: 'Waktu',
       field: 'waktu',
       template: (row)=>{
         return moment(row.waktu).format("dddd, DD MMMM YYYY - HH:mm");
       }
      }, 
      {
       title: 'Created At',
       field: 'created_at',
       template: (row)=>{
        return moment(row.created_at).format("dddd, DD MMMM YYYY - HH:mm");
      }
      }, 
      {
       title: 'User',
       field: 'created_name',
       template: (row)=>{
         return row.created_name;
       }
      }
    ];

    getData(){
      this.setState({loading: true});
      axios.get(API().getMaintenance + "?status=0&" + this.state.query, header(localStorage.getItem('token')))
      .then((response) => {
          let res = response.data;
          let result = SwalResult(res);
          if(result){
            this.setState({data: res.data, loading: false});
            this.props.total(res.data.total);
          }else{
            this.props.total(0);
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
    render(){
      return(
        <TableList
            data          = {this.state.data}
            columns       = {this.columns}
            loading       = {this.state.loading}
            handleRespone = {this.handleRespone}
        />
      )
    }
  }
  class CompleteList extends Component {
    constructor(props) {
      super(props);
      this.state = { 
       data        : null,
       loading     : true,
       query       : "page=1&row=10",
      }
    }
    componentDidMount(){
      this.getData();
    }
    columns = [
      {
        title   : '',
        field   : null,
        width   : 90,
        template: (row) => {
          return (<React.Fragment>
                    <Button onClick={() => this.props.doUpdate(row.id_mt)} title="Ubah" className="btn-stack-overflow btn-brand icon btn-sm">
                      <i className="cui-pencil"></i>
                    </Button> {'   '}
                    <Button onClick={() => this.props.doRead(row.id_mt)} title="Detail" className="btn-info btn-brand icon btn-sm">
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
       title: 'Waktu',
       field: 'waktu',
       template: (row)=>{
         return moment(row.waktu).format("dddd, DD MMMM YYYY - HH:mm");
       }
      }, 
      {
       title: 'Finish At',
       field: 'finish_at',
       template: (row)=>{
        return moment(row.finish_at).format("dddd, DD MMMM YYYY - HH:mm");
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

    getData(){
      this.setState({loading: true});
      axios.get(API().getMaintenance + "?status=1&" + this.state.query, header(localStorage.getItem('token')))
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
    render(){
      return(
        <TableList
            data          = {this.state.data}
            columns       = {this.columns}
            loading       = {this.state.loading}
            handleRespone = {this.handleRespone}
        />
      )
    }
  }  
  export default class Default extends Component {
    constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.state = {
        pageAdd       : false,
        pageUpdate    : false,
        updateLoading : false,
        dataUpdate    : null,
        fotoUpdate    : null,
        optionCabang  : null,
        optionKegiatan: null,
        activeTab     : new Array(4).fill('1'),
        total         : null,
        listactive    : true,
        detailData    : null,
        pageDetail    : false,
        pageLoading   : false,

      };
      
    }
    toggle(tabPane, tab) {
      const newArray = this.state.activeTab.slice()
      newArray[tabPane] = tab
      this.setState({
        activeTab: newArray,
      });
    }
    getData(){
      this.setState({listactive:false});
      this.setState({listactive:true});
    }
    tabPane() {
      if(this.state.listactive){
        return (
          <>
            <TabPane tabId="1">
              <DraftList 
                total    = {(total) => this.setState({total: total})}
                doRead   = {(id) => this.doRead(id)}
                doUpdate = {(id) => this.doUpdate(id)}
              />
            </TabPane>
            <TabPane tabId="2">
              <CompleteList 
                doRead   = {(id) => this.doRead(id)}
                doUpdate = {(id) => this.doUpdate(id)}
              />
            </TabPane>
          </>
        );
      }else{
        return null;
      }
    }
    componentDidMount(){
        this.getCabang();
        this.getKegiatan();
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

    doRead(id){
      this.setState({pageLoading: true});
      axios.get(API().detailMaintenance + "?id="+id, header(localStorage.getItem('token')))
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

    doUpdate(id){
      // alert('tess');
      // return false;
      window.scrollTo(0,0);
      this.setState({dataUpdate: null, pageUpdate: false, updateLoading: true, pageAdd: false});
      axios.get(API().getMaintenanceBy + "?id="+id, header(localStorage.getItem('token')))
      .then((response) => {
          let res = response.data;
          let result = SwalResult(res);
          if(result)
          this.setState({dataUpdate: res.data.maintenance,fotoUpdate: res.data.foto, pageUpdate: true, updateLoading: false});
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error.toString(),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    }
    getKegiatan(){
      axios.get(API().getOptionKegiatan, header(localStorage.getItem('token')))
      .then((response) => {
          let res = response.data;
          let result = SwalResult(res);
          if(result){
              this.setState({optionKegiatan: res.data});
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
        var viewAdd =  null;
        var viewTotal = null;
        if(this.state.optionCabang !== null && this.state.optionKegiatan !== null && this.state.pageAdd){
            viewAdd = (<Add
                          onClick        = {()=>this.setState({pageAdd: false})}
                          refreshData    = {(value) => this.getData()}
                          optionKegiatan = {this.state.optionKegiatan}
                          optionCabang   = {this.state.optionCabang}
                      />)
        }else if(this.state.optionCabang !== null && this.state.optionKegiatan !== null && this.state.pageUpdate){
            viewAdd = (<Update
                          onClick        = {()=>this.setState({pageUpdate: false})}
                          refreshData    = {(value) => this.getData()}
                          optionKegiatan = {this.state.optionKegiatan}
                          optionCabang   = {this.state.optionCabang}
                          data           = {this.state.dataUpdate}
                          foto           = {this.state.fotoUpdate}
                      />)
        }

        if(this.state.total !== null){
          viewTotal = <>  {'  '}  <Badge pill color="danger">{this.state.total}</Badge> </>
        }

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
          <React.Fragment>
            {this.state.updateLoading ? <MetroSpinner size={34} color="#fff" /> : viewAdd}
            <div className="animated fadeIn">
              <Row>
                <Col xs="12" sm="12" md="12">
                  <Card>
                    <CardHeader>
                      <strong>Maintenance</strong>
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
                      <Col xs="12" md="12" className="mb-4">
                        <Nav tabs>
                          <NavItem>
                            <NavLink
                              active={this.state.activeTab[3] === '1'}
                              onClick={() => { this.toggle(3, '1'); }}
                            >
                              <i className="cui-bookmark"></i>
                              <span> Draft List</span>
                              {viewTotal}
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              active={this.state.activeTab[3] === '2'}
                              onClick={() => { this.toggle(3, '2'); }}
                            >
                              <i className="cui-check"></i>
                              <span> Complete List</span>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab[3]}>
                          {this.tabPane()}
                        </TabContent>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
            </React.Fragment>
        )
    }
}