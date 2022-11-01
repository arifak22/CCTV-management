// import React, { Component } from 'react';
import Swal from 'sweetalert2';

function SwalResult(data){
    if(data.api_status === 1){
        return true;
    }else if(data.api_status === 0){
        Swal.fire({
            title            : 'Error!',
            text             : data.api_message,
            icon             : 'error',
            confirmButtonText: 'OK',
        })
    }else if(data.api_status === 401){
        localStorage.removeItem('token');
        localStorage.removeItem('ListMenu');
        Swal.fire({
            title            : 'Auth Failed!',
            text             : data.api_message,
            icon             : 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey   : false,
        }).then((result) =>{
            window.location.reload(true);
        })
    }
}
function SwalLoading(){
    Swal.fire({
        title: 'Wait',
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey   : false,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
export { SwalResult, SwalLoading, makeid };