import React, { Component, useState  } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import TableList from '../../Component/TableComponent';
import { InputForm, SelectForm } from '../../Component/FormComponent';
import { SwalResult, SwalLoading } from '../../Component/Helper';
import { useForm } from 'react-hook-form';
import { API, params, header } from '../../Api';
import { MetroSpinner } from "react-spinners-kit";
function Add(props){
  const { register, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            user_1   : props.ttd_1.user_ttd,
            jabatan_1: props.ttd_1.jabatan,
            user_2   : props.ttd_2.user_ttd,
            jabatan_2: props.ttd_2.jabatan,
            user_3   : props.ttd_3.user_ttd,
            jabatan_3: props.ttd_3.jabatan,
        }
      });
    const [loading, setLoading] = useState(false);
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
            axios.post(API().postTtd, params(data), header(localStorage.getItem('token')))
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
    return(
        <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <strong>Kontraktor</strong><br/>
                <SelectForm 
                    refs={register({
                        required: true,
                        })}
                    name     = "user_1"
                    label    = "Nama TTD"
                    errors   = {errors}
                    data     = {props.optionUser}
                />
                <InputForm 
                    refs={register({
                        required : true,
                        maxLength: {value: 50, message: "50"},
                        })}
                    name   = "jabatan_1"
                    label  = "Jabatan"
                    type   = "text"
                    errors = {errors}
                />
                <hr/>
                <strong>Pengawas</strong><br/>
                <Row>
                    <Col md="6">
                        <SelectForm 
                            refs={register({
                                required: true,
                                })}
                            name     = "user_2"
                            label    = "Nama TTD"
                            errors   = {errors}
                            data     = {props.optionUser}
                        />
                        <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 50, message: "50"},
                                })}
                            name   = "jabatan_2"
                            label  = "Jabatan"
                            type   = "text"
                            errors = {errors}
                        />
                    </Col>
                    <Col md="6">
                        <SelectForm 
                            refs={register({
                                required: true,
                                })}
                            name     = "user_3"
                            label    = "Nama TTD"
                            errors   = {errors}
                            data     = {props.optionUser}
                        />
                        <InputForm 
                            refs={register({
                                required : true,
                                maxLength: {value: 50, message: "50"},
                                })}
                            name   = "jabatan_3"
                            label  = "Jabatan"
                            type   = "text"
                            errors = {errors}
                        />
                    </Col>
                </Row>
                <Button type="submit" size="sm" color="primary" disabled={loading}> {loading ? <MetroSpinner size={16} color="#fff" /> : <span><i className="fa fa-dot-circle-o"></i> Submit</span> }</Button>
            </Form>
        </CardBody>
    )
}
export default class Default extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ttd_1     : null,
            ttd_2     : null,
            ttd_3     : null,
            optionUser: null,
        }
    }
    getTtd(tipe){
        axios.get(API().getTtd + '?tipe='+tipe, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
                if(tipe==1){
                    this.setState({ttd_1: res.data});
                }else if(tipe==2){
                    this.setState({ttd_2: res.data});
                }else if(tipe==3){
                    this.setState({ttd_3: res.data});
                }
                console.log(tipe, res.data)
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

    getUser(){
        axios.get(API().getOptionUser, header(localStorage.getItem('token')))
        .then((response) => {
            let res = response.data;
            let result = SwalResult(res);
            if(result){
                this.setState({optionUser: res.data});
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
    componentDidMount(){
        this.getTtd(1);
        this.getTtd(2);
        this.getTtd(3);
        this.getUser();
    }
    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" md="12">
                        <Card>
                            <CardHeader>
                                <strong>Master TTD</strong>
                            </CardHeader>
                            {this.state.optionUser != null && this.state.ttd_1 != null && this.state.ttd_2 != null && this.state.ttd_3 != null ?
                            <Add 
                                ttd_1      = {this.state.ttd_1}
                                ttd_2      = {this.state.ttd_2}
                                ttd_3      = {this.state.ttd_3}
                                optionUser = {this.state.optionUser}
                            />
                            :
                            <CardBody>Loading...</CardBody>
                            }
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}