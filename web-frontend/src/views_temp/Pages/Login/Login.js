import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback, FormGroup } from 'reactstrap';
import {Field, Formik, Form } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import Swal from 'sweetalert2';
import { API, params } from '../../../Api';

class Login extends Component {
  SubmitLogin(values){
    axios.post(API().Login, params({username:values.username, password:values.password}))
    .then((response) => {
        let res = response.data;
        if(res.api_status === 1){
          Swal.fire({
            title: 'Sukses!',
            text: 'Berhasil Login',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
              localStorage.setItem("token", res.access_token);
              localStorage.setItem("ListMenu", JSON.stringify(res.access_menu));
              window.location.reload(true);
          });
        }else{
          Swal.fire({
            title: 'Error!',
            text: res.api_message,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
    })
    .catch((error) => {
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
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                  <Formik
                    initialValues={{
                      username: '',
                      password: '',
                    }}
                    validationSchema={Yup.object().shape({

                      username: Yup.string()
                        .matches(/^[0-9a-z_.-]+$/,'username must numeric and lower alphabet')
                        .min(6)
                        .max(20)
                        .required(),
                        
                      password: Yup.string()
                        .required(),
                    })}
                    onSubmit={values => {this.SubmitLogin(values)}}
                    >
                    {({ errors, touched }) => (
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <FormGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" invalid={errors.username && touched.username} name="username" tag={Field} placeholder="Username" autoComplete="username"/>
                        <FormFeedback>{errors.username}</FormFeedback>
                      </InputGroup>
                      </FormGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" invalid={errors.password && touched.password} name="password" tag={Field} placeholder="Password" autoComplete="password"/>
                        <FormFeedback>{errors.password}</FormFeedback>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" >Login</Button>
                        </Col>
                      </Row>
                    </Form>
                    )}
                    </Formik>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
