import { Redirect } from 'react-router-dom';
import { baseUrl } from './Api';

export function checkAkses(){
    var base_url    = window.location.origin;
    var current_url = document.URL;
    var active_url  = current_url.replace(base_url,'').replace('/#','');
    var access = JSON.parse(localStorage.getItem("ListMenu")).access;
    return access.includes(active_url);
    return JSON.parse(localStorage.getItem("ListMenu")).access;
    return JSON.parse(localStorage.getItem("ListMenu")) + baseUrl + document.URL;
}