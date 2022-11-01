import React, { Component, useState, useEffect  } from 'react';
import { FormGroup, Input, Label, FormFeedback, Col, Row} from 'reactstrap';
import Datetime from 'react-datetime';
import Resizer from 'react-image-file-resizer';
import Swal from 'sweetalert2';

import 'moment/locale/id';
var moment = require('moment');

function getError(value){
    let errormessage = "Mengalami masalah";
    if(value && value.message === ""){
        switch (value.type) {
            case 'required':
                errormessage ='Wajib di isi.';
                break;
            case 'min':
                errormessage ='Kurang dari nilai minimal.';
                break;
            case 'max':
                errormessage ='Lebih dari nilai maksimal.';
                break;
            case 'minLength':
                errormessage ='Panjang karakter kurang.';
                break;
            case 'maxLength':
                errormessage ='Panjang karakter lebih.';
                break;
            default:
                break;
        }
    }else if(value){
        switch (value.type) {
            case 'required':
                errormessage = value.message;
                break;
            case 'min':
                errormessage ='Nilai harus lebih dari: ' +value.message;
                break;
            case 'max':
                errormessage ='Nilai harus kurang dari: ' +value.message;
                break;
            case 'minLength':
                errormessage ='Panjang karakter harus lebih dari: ' +value.message;
                break;
            case 'maxLength':
                errormessage ='Panjang karakter harus kurang dari: ' +value.message;
                break;
            default:
                errormessage = value.message;
                break;
        }
    }
    return errormessage;
}

function InputForm(props) {
    let errormessage = getError(props.errors[props.name]);
    return(
        <FormGroup>
            <Label>{props.label}</Label>
            <Input 
                name     = {props.name}
                invalid  = {props.errors[props.name] && true}
                onChange = {props.onChange}
                innerRef = {props.refs}
                type     = {props.type}
                value    = {props.value}
                rows     = {props.rows}
                disabled = {props.disabled ? props.disabled : false}
            />
            <FormFeedback>{props.errors[props.name] && errormessage}</FormFeedback>
        </FormGroup>
    )
}
function FileForm(props) {
    const [fileFoto, setFileFoto] = useState(props.value);

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
                getFile(event)
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
                        uri => { getFile(event, uri) },
                        'base64'
                    );
                }
            }
        }else{
            getFile(event)
        }
    }
    const getFile = (event, uri=null) => {
        setFileFoto(uri)
        props.onChange && props.onChange(event, uri)
    }
    let errormessage = getError(props.errors[props.name]);
    return(
        <FormGroup>
            <Label>{props.label}</Label>
            <Input 
                type     = "file"
                onChange = {(event) => fileChangedHandler(event)}
                accept   = "image/*"
            />
            {fileFoto ? <img style={{width:'120px'}} src={fileFoto}/> : null}
            <Input 
                innerRef = {props.refs}
                type     = "hidden"
                name     = {props.name}
                invalid  = {props.errors[props.name] && true}
                value    = {fileFoto || ''}
            />
            <FormFeedback>{props.errors[props.name] && errormessage}</FormFeedback>
        </FormGroup>
    )
}

function DateForm(props){
    let errormessage = getError(props.errors[props.name]);
    let dateInit = null;
    let timeInit = null;
    const [value, setValue]     = useState(props.value);
    if(props.value){
        dateInit =  moment(props.value).format("YYYY-MM-DD");
        timeInit =  moment(props.value).format("HH:mm");
    }
    const [valdate, setValdate] = useState(dateInit);
    const [valtime, setValtime] = useState(timeInit);

    const handleDate = e => {
        var result = null;
        if(typeof e === 'string'){
            setValue(null);
            console.log('is string');
        }else{
            var date   = e._d;
            var day    = date.getDate();
            var month  = date.getMonth() + 1;
            var year   = date.getFullYear();

            result = moment(date).format("YYYY-MM-DD");
            // result = year + '-' + ('0' + month).slice(-2) + '-' +  ('0' + day).slice(-2);
            setValdate(result);
            if(valtime !== null)
            setValue(result + ' ' + valtime);
        }
        if(props.onChange)
        props.onChange(e);
    }
    const handleTime = e => {
        var result = null;
        if(typeof e === 'string'){
            setValue(null);
            console.log('is string');
        }else{
            var date   = e._d;
            var hour   = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            result = moment(date).format("HH:mm");

            // result = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
            setValtime(result);
            if(valdate !== null)
            setValue(valdate + ' ' + result);
        }
        if(props.onChange)
        props.onChange(e);
    }
    return(
        <FormGroup>
            <Label>{props.label}</Label>
            <Row>
                <Col md="8">
                    <Datetime 
                        onChange   = {(e) => handleDate(e) }
                        dateFormat = "dddd, DD MMMM YYYY"
                        timeFormat = {false}
                        locale     = "id"
                        value      = {valdate && moment(valdate).format("dddd, DD MMMM YYYY")}
                    />
                </Col>
                <Col md="4">
                    <Datetime 
                        onChange   = {(e) => handleTime(e) }
                        dateFormat = {false}
                        timeFormat = "HH:mm"
                        locale     = "id"
                        value      = {valtime}
                    />
                </Col>
            </Row>
            <Input 
                innerRef = {props.refs}
                type     = "hidden"
                name     = {props.name}
                invalid  = {props.errors[props.name] && true}
                value    = {value || ''}
            />
            <FormFeedback>{props.errors[props.name] && errormessage}</FormFeedback>
        </FormGroup>
    )
}

function SelectForm(props){
    let errormessage = getError(props.errors[props.name]);
    return(
        <FormGroup>
            <Label>{props.label}</Label>
            <Input 
                name     = {props.name}
                invalid  = {props.errors[props.name] && true}
                onChange = {props.onChange}
                innerRef = {props.refs}
                type     = "select"
                value    = {props.value}
            >
                {props.data.map((option, key) =>
                    <option key={key} value={option.value}>
                    {option.name}
                    </option>
                )}
            </Input>
            <FormFeedback>{props.errors[props.name] && errormessage}</FormFeedback>
        </FormGroup>
    )
}
export {InputForm, FileForm, SelectForm, DateForm, getError};