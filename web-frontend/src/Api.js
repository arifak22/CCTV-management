
import qs from "qs";

export const debug = true

export function ServerUrl(url){
    if(debug){
        return 'http://localhost:8888/MJC/backend/public/' + url;
    }else{
        return 'https://www.sideveloper.com/mjc/backend/public/' + url;
    }
}
export function Assets(url){
    if(debug){
        return 'http://localhost:8888/MJC/backend/storage/app/' + url;
    }else{
        return 'https://www.sideveloper.com/mjc/backend/storage/app/' + url;
    }
}
export function baseUrl(url){
    if(debug){
        return 'http://localhost:3000/#/' + url;
    }else{
        return 'https://www.sideveloper.com/mjc/' + url;
    }
}
export function params(param){
    return qs.stringify(param);
}
export function formData(param){

}
export function header(jwt, content='application/x-www-form-urlencoded', responseType = 'json'){
    return {
            headers:{
                'Content-Type': `${content}`,
                'Authorization': `Bearer ${jwt}`,
            },
            responseType: responseType,
        }
}

export function API() {
    return {
        Login : ServerUrl('api/auth/login'),

        //SYSTEM
        getSys  : ServerUrl('api/auth/system'),

        
        //SYSTEM
        getCard  : ServerUrl('api/dashboard/card'),


        //OPTION
        getOptionCabang    : ServerUrl('api/master/option-cabang'),
        getOptionLokasi    : ServerUrl('api/master/option-lokasi'),
        getOptionTiang     : ServerUrl('api/master/option-tiang'),
        getOptionMerk      : ServerUrl('api/master/option-merk'),
        getOptionPerusahaan: ServerUrl('api/master/option-perusahaan'),
        getOptionPriv      : ServerUrl('api/master/option-privilege'),
        getOptionMenu      : ServerUrl('api/master/option-menu'),
        getOptionCctv      : ServerUrl('api/master/option-cctv'),
        getOptionKegiatan  : ServerUrl('api/master/option-kegiatan'),
        getOptionStatus    : ServerUrl('api/master/option-status'),
        getOptionUser      : ServerUrl('api/master/option-user'),

        //CRUD MASTER TIANG
        getMasterTiang   : ServerUrl('api/master/tiang'),
        postMasterTiang  : ServerUrl('api/master/tiang'),
        deleteMasterTiang: ServerUrl('api/master/delete-tiang'),
        getMasterTiangBy : ServerUrl('api/master/tiang-by'),
        updateMasterTiang: ServerUrl('api/master/update-tiang'),

        //CRUD MASTER PERUSAHAAN
        postMasterPerusahaan  : ServerUrl('api/master/perusahaan'),
        getMasterPerusahaan   : ServerUrl('api/master/perusahaan'),
        deleteMasterPerusahaan: ServerUrl('api/master/delete-perusahaan'),
        getMasterPerusahaanBy : ServerUrl('api/master/perusahaan-by'),
        updateMasterPerusahaan: ServerUrl('api/master/update-perusahaan'),
        getListAksesCctv      : ServerUrl('api/master/list-akses-cctv'),
        postListAksesCctv     : ServerUrl('api/master/list-akses-cctv'),
        
        //CRUD MASTER LOKASI
        getMasterLokasi   : ServerUrl('api/master/lokasi'),
        postMasterLokasi  : ServerUrl('api/master/lokasi'),
        deleteMasterLokasi: ServerUrl('api/master/delete-lokasi'),
        getMasterLokasiBy : ServerUrl('api/master/lokasi-by'),
        updateMasterLokasi: ServerUrl('api/master/update-lokasi'),

        //CRUD MASTER CABANG
        getMasterCabang   : ServerUrl('api/master/cabang'),
        postMasterCabang  : ServerUrl('api/master/cabang'),
        deleteMasterCabang: ServerUrl('api/master/delete-cabang'),
        getMasterCabangBy : ServerUrl('api/master/cabang-by'),
        updateMasterCabang: ServerUrl('api/master/update-cabang'),

        //CRUD MASTER MERK
        getMasterMerk   : ServerUrl('api/master/merk'),
        postMasterMerk  : ServerUrl('api/master/merk'),
        deleteMasterMerk: ServerUrl('api/master/delete-merk'),
        getMasterMerkBy : ServerUrl('api/master/merk-by'),
        updateMasterMerk: ServerUrl('api/master/update-merk'),

        //CRUD MASTER CCTV
        getMasterCctv   : ServerUrl('api/master/cctv'),
        postMasterCctv  : ServerUrl('api/master/cctv'),
        deleteMasterCctv: ServerUrl('api/master/delete-cctv'),
        getMasterCctvBy : ServerUrl('api/master/cctv-by'),
        updateMasterCctv: ServerUrl('api/master/update-cctv'),
        detailMasterCctv: ServerUrl('api/master/detail-cctv'),

        //CRUD MASTER USER
        getMasterUser   : ServerUrl('api/master/user'),
        postMasterUser  : ServerUrl('api/master/user'),
        statusMasterUser: ServerUrl('api/master/status-user'),
        getMasterUserBy : ServerUrl('api/master/user-by'),
        updateMasterUser: ServerUrl('api/master/update-user'),
        detailMasterUser: ServerUrl('api/master/detail-user'),

        //CRUD MASTER PRIVILEGE
        getMasterPrivilege   : ServerUrl('api/master/privilege'),
        postMasterPrivilege  : ServerUrl('api/master/privilege'),
        deleteMasterPrivilege: ServerUrl('api/master/delete-privilege'),
        getMasterPrivilegeBy : ServerUrl('api/master/privilege-by'),
        updateMasterPrivilege: ServerUrl('api/master/update-privilege'),
        getListPermission    : ServerUrl('api/master/list-permission'),
        postListPermission   : ServerUrl('api/master/list-permission'),

        //CRUD MASTER MENU
        getMasterMenu   : ServerUrl('api/master/menu'),
        postMasterMenu  : ServerUrl('api/master/menu'),
        deleteMasterMenu: ServerUrl('api/master/delete-menu'),
        getMasterMenuBy : ServerUrl('api/master/menu-by'),
        updateMasterMenu: ServerUrl('api/master/update-menu'),

        //CRUD MASTER SUB MENU
        getMasterSubmenu   : ServerUrl('api/master/sub-menu'),
        postMasterSubmenu  : ServerUrl('api/master/sub-menu'),
        deleteMasterSubmenu: ServerUrl('api/master/delete-sub-menu'),
        getMasterSubmenuBy : ServerUrl('api/master/sub-menu-by'),
        updateMasterSubmenu: ServerUrl('api/master/update-sub-menu'),

        // CRUD MASTER TTD
        getTtd : ServerUrl('api/master/ttd'),
        postTtd : ServerUrl('api/master/ttd'),

        //MAINTENANCE
        //ADD Maintenance
        postMaintenance  : ServerUrl('api/maintenance/save'),
        getMaintenance   : ServerUrl('api/maintenance/list'),
        deleteMaintenance: ServerUrl('api/maintenance/delete'),
        detailMaintenance: ServerUrl('api/maintenance/detail'),
        getMaintenanceBy : ServerUrl('api/maintenance/update-by'),
        updateMaintenance: ServerUrl('api/maintenance/update'),
        exportReport     : ServerUrl('api/maintenance/export-report'),
        exportLampiran   : ServerUrl('api/maintenance/export-lampiran'),

        //INCIDENT
        //ADD Incident
        postIncident  : ServerUrl('api/incident/save'),
        getIncident   : ServerUrl('api/incident/list'),
        deleteIncident: ServerUrl('api/incident/delete'),
        detailIncident: ServerUrl('api/incident/detail'),
        getIncidentBy : ServerUrl('api/incident/update-by'),
        updateIncident: ServerUrl('api/incident/update'),
        exportReportInc  : ServerUrl('api/incident/export-report'),
        exportLampiranInc: ServerUrl('api/incident/export-lampiran'),

        //REPORT
        postProsesDaily: ServerUrl('api/report/proses-daily'),
        getDaily: ServerUrl('api/report/daily'),
        getExcelDaily: ServerUrl('api/report/excel-daily'),

        postProsesRealisasi: ServerUrl('api/report/proses-realisasi'),
        getRealisasi: ServerUrl('api/report/realisasi'),
        getExcelRealisasi: ServerUrl('api/report/excel-realisasi'),

    }
}