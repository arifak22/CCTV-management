<?php  
/** DEV
 * ARIF KURNIAWAN
 * arif@sideveloper.com
 * 08985565211
 * www.sideveloper.com
 * Created At: Mei 2020
 */
namespace App\Http\Controllers;

use App;
use Cache;
use Config;
use Crypt;
use DB;
use File;
use Excel;
use Hash;
use Log;
use PDF;
use Request;
use Route;
use Session;
use Storage;
use Schema;
use Validator;
use Sideveloper;
use Auth;

class ApiMasterController extends MiddleController
{
    
    /**
     * MASTER OPTION GET
     */

     #GET OPTION CABANG
     public function getOptionCabang(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('cabangs');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA CABANG -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_cabang;
                $result[$i]['name'] = $value->nama_cabang;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION LOKASI
     public function getOptionLokasi(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('lokasis');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA LOKASI -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_lokasi;
                $result[$i]['name'] = $value->nama_lokasi;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION TIANG
     public function getOptionTiang(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('tipe_tiangs');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA TIPE TIANG -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_tipe_tiang;
                $result[$i]['name'] = $value->nama_tipe;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION MERK
     public function getOptionMerk(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('syscodes')->where('code','=','MK');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA MERK -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->value;
                $result[$i]['name'] = $value->deskripsi;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION PERUSAHAAN
     public function getOptionPerusahaan(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('perusahaans');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA PERUSAHAAN -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_perusahaan;
                $result[$i]['name'] = $value->nama_perusahaan;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION PRIVILEGE
     public function getOptionPrivilege(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('privileges');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA PRIVILEGE -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_privilege;
                $result[$i]['name'] = $value->nama_privilege;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION MENU
     public function getOptionMenu(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('menus');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA MENU -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_menu;
                $result[$i]['name'] = $value->nama_menu;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION CCTV
     public function getOptionCctv(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('cctvs');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA CCTV -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_cctv;
                $result[$i]['name'] = $value->kode_cctv . ' ('.$value->nama_cctv.')';
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION KEGIATAN
     public function getOptionKegiatan(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('syscodes')->where('code','=','KG');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA KEGIATAN -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->value;
                $result[$i]['name'] = $value->deskripsi;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION STATUS
     public function getOptionStatus(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('incident_master_status');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA STATUS -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->id_status_inc;
                $result[$i]['name'] = $value->nama_status;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

     #GET OPTION USER
     public function getOptionUser(){
        $all       = Request::input('all');
        $parameter = Request::input();
        unset($parameter['all']);
        try {
            $query  = DB::table('users');
            foreach($parameter as $key => $value){
                if($value)
                $query->where($key, '=', $value);
            }
            $data = $query->get();
            $result = [];
            $i = 0;
            if($all && $query->count()>1){
                $result[$i]['value'] = '';
                $result[$i]['name'] = '- SEMUA USER -';
                $i = 1;
            }
            foreach($data as $value){
                $result[$i]['value'] = $value->username;
                $result[$i]['name'] = $value->nama;
                $i++;
            }
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $result;
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami Masalah.';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
     }

    


    /**
     * MASTER TIANG
     */

    #READ TIANG
    public function getTiang(){
        $row    = Request::input('row');
        $search = Request::input('search');
        $sort   = Request::input('sort');
        $by     = Request::input('by');
        $query  = DB::table('tipe_tiangs');
        
        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_tipe', 'ketinggian'];
            foreach ($field_search as $field) {
                $query->orWhere($field, 'like', "%$search%");
            }
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('created_at','desc');
        $data = $query->paginate($row);
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE TIANG
    public function postTiang(){
        $tipe   = $this->input('tipe', 'required');
        $tinggi = $this->input('tinggi', 'required|numeric');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_tipe']  = $tipe;
        $save['ketinggian'] = $tinggi;
        $result = Sideveloper::insert('tipe_tiangs', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE TIANG
    public function postDeleteTiang(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $delete = DB::table('tipe_tiangs')->where('id_tipe_tiang', '=', $id);
        $result = Sideveloper::delete('tipe_tiangs', $delete);

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dihapus.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE TIANG
    public function getTiangBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('tipe_tiangs')->where('id_tipe_tiang', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE TIANG
    public function postUpdateTiang(){
        $id     = $this->input('id', 'required');
        $tipe   = $this->input('tipe', 'required');
        $tinggi = $this->input('tinggi', 'required|numeric');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_tipe']  = $tipe;
        $save['ketinggian'] = $tinggi;
        $where = array(['id_tipe_tiang','=', $id]);
        $result = Sideveloper::update('tipe_tiangs', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }


    
    /**
     * MASTER PERUSAHAAN
     */

    #READ PERUSAHAAN
    public function getPerusahaan(){
        $row    = Request::input('row');
        $search = Request::input('search');
        $sort   = Request::input('sort');
        $by     = Request::input('by');
        $query  = DB::table('perusahaans');
        
        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_perusahaan'];
            foreach ($field_search as $field) {
                $query->orWhere($field, 'like', "%$search%");
            }
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('created_at','desc');
        $data = $query->paginate($row);
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE PERUSAHAAN
    public function postPerusahaan(){
        $nama       = $this->input('nama', 'required|max:200');
        $alias      = $this->input('alias', 'required|max:20');
        $intern     = $this->input('intern', 'required');
        $keterangan = $this->input('keterangan', 'required|max:2000');

        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_perusahaan'] = $nama;
        $save['alias']           = $alias;
        $save['intern']          = $intern;
        $save['keterangan']      = $keterangan;
        $result = Sideveloper::insert('perusahaans', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE PERUSAHAAN
    public function postDeletePerusahaan(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $delete = DB::table('perusahaans')->where('id_perusahaan', '=', $id);
        $result = Sideveloper::delete('perusahaans', $delete);

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dihapus.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE PERUSAHAAN
    public function getPerusahaanBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('perusahaans')->where('id_perusahaan', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE PERUSAHAAN
    public function postUpdatePerusahaan(){
        $id         = $this->input('id', 'required');
        $nama       = $this->input('nama', 'required|max:200');
        $alias      = $this->input('alias', 'required|max:20');
        $intern     = $this->input('intern', 'required');
        $keterangan = $this->input('keterangan', 'required|max:2000');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_perusahaan'] = $nama;
        $save['alias']           = $alias;
        $save['intern']          = $intern;
        $save['keterangan']      = $keterangan;
        $where = array(['id_perusahaan','=', $id]);
        $result = Sideveloper::update('perusahaans', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET LIST AKSES CCTV
    public function getListAksesCctv(){
        $id_cabang     = $this->input('id_cabang', 'required');
        $id_perusahaan = $this->input('id_perusahaan', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }

        $data = DB::table('cctvs')
            ->select('cctvs.id_cctv', 'akses_cctvs.id_perusahaan', 'cabangs.id_cabang', 'cctvs.id_lokasi', 'kode_cctv', 'nama_cctv', 'nama_lokasi')
            ->join('lokasis','cctvs.id_lokasi','=','lokasis.id_lokasi')
            ->join('cabangs','cabangs.id_cabang','=','lokasis.id_cabang')
            ->leftJoin('akses_cctvs', function ($join) use($id_perusahaan) {
                $join->on('akses_cctvs.id_cctv', '=', 'cctvs.id_cctv')
                     ->where('akses_cctvs.id_perusahaan', '=', $id_perusahaan);
            })
            ->where('cabangs.id_cabang', '=', $id_cabang)
            ->where('cctvs.status','=','1')
            ->get();
        $old = true;
        foreach($data as $cctv){ 
            $list['id_cctv']   = $cctv->id_cctv;
            $list['id_lokasi'] = $cctv->id_lokasi;
            $list['kode_cctv'] = $cctv->kode_cctv;
            $list['nama_cctv'] = $cctv->nama_cctv;
            $list['isChecked'] = $cctv->id_perusahaan != null ? true : false;
            $new = $cctv->id_perusahaan != null ? true : false;
            $categories[$cctv->id_lokasi]['nama_lokasi'] = $cctv->nama_lokasi;
            $categories[$cctv->id_lokasi]['id_lokasi']   = $cctv->id_lokasi;
            $old = $old * $new;
            $categories[$cctv->id_lokasi]['isChecked']   = $old == 1 ? true : false;
            $categories[$cctv->id_lokasi]['data'][]      = $list;
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success';
        $respone['data']        = array_values($categories);
        return $this->api_output($respone);

    }
    #POST LIST AKSES CCTV
    public function postListAksesCctv(){
        $id_perusahaan = $this->input('id', 'required');
        $id_cabang     = $this->input('cabang', 'required');
        $cctv          = $this->input('cctv');
        $delete = DB::table('akses_cctvs')->where('id_perusahaan', '=', $id_perusahaan)
        ->whereIn('id_cctv', function($query) use($id_cabang){
            $query->select('id_cctv')
            ->from('cctvs')
            ->join('lokasis','cctvs.id_lokasi','=','lokasis.id_lokasi')
            ->where('id_cabang', $id_cabang);
        })->delete();
        $save = array();
        if($cctv){
            if(is_array($cctv)){
                foreach($cctv as $key => $c){
                    $save[$key]['id_perusahaan'] = $id_perusahaan;
                    $save[$key]['id_cctv']       = $c;
                    $save[$key]['updated_at']    = new \DateTime();
                }
            }else{
                $save['id_perusahaan'] = $id_perusahaan;
                $save['id_cctv']       = $cctv;
                $save['updated_at']    = new \DateTime();
            }
            $result = DB::table('akses_cctvs')->insert($save);
            if($result){
                Sideveloper::createLog('UPDATE_TB akses_cctvs');
                $respone['api_status']  = 1;
                $respone['api_message'] = 'success';
                $respone['cctv']        = $cctv;
                $respone['save']        = $save;
                return $this->api_output($respone);
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah';
                return $this->api_output($respone);
            }
        }else{
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            return $this->api_output($respone);
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success';
        return $this->api_output($respone);
    }


    /**
     * MASTER LOKASI
     */

    #READ LOKASI
    public function getLokasi(){
        
        $row       = Request::input('row');
        $search    = Request::input('search');
        $sort      = Request::input('sort');
        $by        = Request::input('by');
        $id_cabang = Request::input('id_cabang');

        $query  = DB::table('lokasis');
        
        $query->where('id_cabang','=',$id_cabang);

        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['kode_lokasi','nama_lokasi','alias_lokasi', 'koordinat'];
            $query->where(function($query) use ($field_search, $search){
                foreach ($field_search as $field) {
                    $query->orWhere($field, 'like', "%$search%");
                }
            });
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('created_at','desc');
        $data = $query->paginate($row);
        
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE LOKASI
    public function postLokasi(){
        $id_cabang   = $this->input('id_cabang', 'required');
        $kode_lokasi = $this->input('kode_lokasi', 'required|max:50');
        $nama_lokasi = $this->input('nama_lokasi', 'required|max:100');
        $alias       = $this->input('alias', 'max:50');
        $koordinat   = $this->input('koordinat', 'max:200');

        if($this->validator()){
            return  $this->validator(true);
        }
        $save['id_cabang']    = $id_cabang;
        $save['kode_lokasi']  = $kode_lokasi;
        $save['nama_lokasi']  = $nama_lokasi;
        $save['alias_lokasi'] = $alias;
        $save['koordinat']    = $koordinat;
        $result = Sideveloper::insert('lokasis', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE LOKASI
    public function postDeleteLokasi(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $delete = DB::table('lokasis')->where('id_lokasi', '=', $id);
        $result = Sideveloper::delete('lokasis', $delete);

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dihapus.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE LOKASI
    public function getLokasiBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('lokasis')->where('id_lokasi', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE LOKASI
    public function postUpdateLokasi(){
        $id         = $this->input('id', 'required');
        $id_cabang   = $this->input('id_cabang', 'required');
        $kode_lokasi = $this->input('kode_lokasi', 'required|max:50');
        $nama_lokasi = $this->input('nama_lokasi', 'required|max:100');
        $alias       = $this->input('alias', 'max:50');
        $koordinat   = $this->input('koordinat', 'max:200');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['id_cabang']    = $id_cabang;
        $save['kode_lokasi']  = $kode_lokasi;
        $save['nama_lokasi']  = $nama_lokasi;
        $save['alias_lokasi'] = $alias;
        $save['koordinat']    = $koordinat;
        $where = array(['id_lokasi','=', $id]);
        $result = Sideveloper::update('lokasis', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

     /**
     * MASTER CABANG
     */

    #READ CABANG
    public function getCabang(){
        $row    = Request::input('row');
        $search = Request::input('search');
        $sort   = Request::input('sort');
        $by     = Request::input('by');
        $query  = DB::table('cabangs');
        
        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_cabang', 'alias_cabang'];
            foreach ($field_search as $field) {
                $query->orWhere($field, 'like', "%$search%");
            }
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('created_at','desc');
        $data = $query->paginate($row);
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE CABANG
    public function postCabang(){
        $nama_cabang  = $this->input('nama_cabang', 'required|max:100');
        $alias_cabang = $this->input('alias_cabang', 'required|max:50');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_cabang']  = $nama_cabang;
        $save['alias_cabang'] = $alias_cabang;
        $result = Sideveloper::insert('cabangs', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE CABANG
    public function postDeleteCabang(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        try {
            $delete = DB::table('cabangs')->where('id_cabang', '=', $id);
            $result = Sideveloper::delete('cabangs', $delete);

            if($result){
                $respone['api_status']  = 1;
                $respone['api_message'] = 'Data berhasil dihapus.';
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah.';
            }
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data sudah digunakan di master.';
        }
        return $this->api_output($respone);
        
    }

    #GET UPDATE CABANG
    public function getCabangBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('cabangs')->where('id_cabang', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE CABANG
    public function postUpdateCabang(){
        $id           = $this->input('id', 'required');
        $nama_cabang  = $this->input('nama_cabang', 'required|max:100');
        $alias_cabang = $this->input('alias_cabang', 'required|max:50');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_cabang']  = $nama_cabang;
        $save['alias_cabang'] = $alias_cabang;
        $where = array(['id_cabang','=', $id]);
        $result = Sideveloper::update('cabangs', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    /**
     * MASTER CCTV
     */

    #READ CCTV
    public function getCctv(){
        $row           = Request::input('row');
        $search        = Request::input('search');
        $sort          = Request::input('sort');
        $by            = Request::input('by');
        $id_cabang     = Request::input('id_cabang');
        $id_lokasi     = Request::input('id_lokasi');
        $id_tipe_tiang = Request::input('id_tipe_tiang');
        $code_merk     = Request::input('code_merk');

        $query  = DB::table('cctvs')
        ->select('id_cctv','kode_cctv','nama_cctv','ip','type','status',
        'nama_lokasi','nama_tipe','deskripsi as nama_merk','username','password');
        
        if(!($id_cabang === null || $id_cabang === '' || $id_cabang ===' ')){
            $query->where('lokasis.id_cabang','=',$id_cabang);
        }
        if(!($id_lokasi === null || $id_lokasi === '' || $id_lokasi ===' ')){
            $query->where('cctvs.id_lokasi','=',$id_lokasi);
        }
        if(!($id_tipe_tiang === null || $id_tipe_tiang === '' || $id_tipe_tiang ===' ')){
            $query->where('cctvs.id_tipe_tiang','=',$id_tipe_tiang);
        }
        if(!($code_merk === null || $code_merk === '' || $code_merk ===' ')){
            $query->where('cctvs.id_merk','=',$code_merk);
        }

        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['kode_cctv','nama_cctv', 'ip'];
            $query->where(function($query) use ($field_search, $search){
                foreach ($field_search as $field) {
                    $query->orWhere($field, 'like', "%$search%");
                }
            });
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->join('lokasis', 'cctvs.id_lokasi', '=', 'lokasis.id_lokasi')
            ->join('tipe_tiangs','cctvs.id_tipe_tiang','=','tipe_tiangs.id_tipe_tiang')
            ->join('syscodes', function ($join) {
                $join->on('cctvs.id_merk', '=', 'syscodes.value')
                     ->where('syscodes.code', '=', 'MK');
            });
        $query->orderBy('cctvs.created_at','desc');
        $data = $query->paginate($row);
        
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE CCTV
    public function postCctv(){
        $kode_cctv     = $this->input('kode_cctv', 'required');
        $nama_cctv     = $this->input('nama_cctv', 'required');
        $ip            = $this->input('ip_address', 'required');
        $type          = $this->input('type', 'required');
        $status        = $this->input('status', 'required');
        $id_lokasi     = $this->input('id_lokasi', 'required');
        $id_tipe_tiang = $this->input('id_tipe_tiang', 'required');
        $keterangan    = $this->input('keterangan', 'required');
        $id_merk       = $this->input('id_merk', 'required');
        $username      = $this->input('username', 'required');
        $password      = $this->input('password', 'required');
        $perusahaan    = $this->input('perusahaan');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['kode_cctv']     = $kode_cctv;
        $save['nama_cctv']     = $nama_cctv;
        $save['ip']            = $ip;
        $save['type']          = $type;
        $save['status']        = $status;
        $save['id_lokasi']     = $id_lokasi;
        $save['id_tipe_tiang'] = $id_tipe_tiang;
        $save['keterangan']    = $keterangan;
        $save['id_merk']       = $id_merk;
        $save['username']      = $username;
        $save['password']      = $password;
        $result = Sideveloper::insertID('cctvs', $save);
        if($result){
            //INSERT AKSES CCTV
            if($perusahaan){
                if(is_array($perusahaan)){
                    foreach($perusahaan as $key => $p){
                        $akses[$key]['id_perusahaan'] = $p;
                        $akses[$key]['id_cctv']       = $result;
                        $akses[$key]['updated_at']    = new \DateTime();
                    }
                }else{
                    $akses['id_perusahaan'] = $perusahaan;
                    $akses['id_cctv']       = $result;
                    $akses['updated_at']    = new \DateTime();
                }
                $result = DB::table('akses_cctvs')->insert($akses);
                if($result){
                    $respone['api_status']  = 1;
                    $respone['api_message'] = 'Data berhasil dimasukan.';
                }else{
                    $respone['api_status']  = 0;
                    $respone['api_message'] = 'Mengalami masalah.';
                }
            }else{
                $respone['api_status']  = 1;
                $respone['api_message'] = 'Data berhasil dimasukan.';
            }
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

     #DELETE CCTV
     public function postDeleteCctv(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        try {
            $delete = DB::table('cctvs')->where('id_cctv', '=', $id);
            $result = Sideveloper::delete('cctvs', $delete);

            if($result){
                $respone['api_status']  = 1;
                $respone['api_message'] = 'Data berhasil dihapus.';
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah.';
            }
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data sudah digunakan di master.';
        }
        return $this->api_output($respone);
        
    }

     #GET UPDATE CCTV
     public function getCctvBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('cctvs')->select('cctvs.*','lokasis.id_cabang')->join('lokasis','cctvs.id_lokasi', '=', 'lokasis.id_lokasi')->where('id_cctv', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE CCTV
    public function postUpdateCctv(){
        $id           = $this->input('id', 'required');
        $kode_cctv     = $this->input('kode_cctv', 'required');
        $nama_cctv     = $this->input('nama_cctv', 'required');
        $ip            = $this->input('ip_address', 'required');
        $type          = $this->input('type', 'required');
        $status        = $this->input('status', 'required');
        $id_lokasi     = $this->input('id_lokasi', 'required');
        $id_tipe_tiang = $this->input('id_tipe_tiang', 'required');
        $keterangan    = $this->input('keterangan', 'required');
        $id_merk       = $this->input('id_merk', 'required');
        $username      = $this->input('username', 'required');
        $password      = $this->input('password', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['kode_cctv']     = $kode_cctv;
        $save['nama_cctv']     = $nama_cctv;
        $save['ip']            = $ip;
        $save['type']          = $type;
        $save['status']        = $status;
        $save['id_lokasi']     = $id_lokasi;
        $save['id_tipe_tiang'] = $id_tipe_tiang;
        $save['keterangan']    = $keterangan;
        $save['id_merk']       = $id_merk;
        $save['username']      = $username;
        $save['password']      = $password;
        $where = array(['id_cctv','=', $id]);
        $result = Sideveloper::update('cctvs', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET DETAIL CCTV
    public function getDetailCctv(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data =DB::table('cctvs')
        ->select('id_cctv','kode_cctv','nama_cctv','ip','type','status','nama_lokasi','nama_tipe','deskripsi as nama_merk','username','password', 'keterangan')
        ->join('lokasis', 'cctvs.id_lokasi', '=', 'lokasis.id_lokasi')
        ->join('tipe_tiangs','cctvs.id_tipe_tiang','=','tipe_tiangs.id_tipe_tiang')
        ->join('syscodes', function ($join) {
            $join->on('cctvs.id_merk', '=', 'syscodes.value')
                    ->where('syscodes.code', '=', 'MK');
        })
        ->where('id_cctv', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    /**
     * MASTER USER
     */

    #READ USER
    public function getUser(){
        $row           = Request::input('row');
        $search        = Request::input('search');
        $sort          = Request::input('sort');
        $by            = Request::input('by');
        $id_perusahaan = Request::input('id_perusahaan');

        $query  = DB::table('users')
        ->select('id','username','nama', 'status','nama_perusahaan','nama_privilege');
        
        if(!($id_perusahaan === null || $id_perusahaan === '' || $id_perusahaan ===' ')){
            $query->where('perusahaans.id_perusahaan','=',$id_perusahaan);
        }

        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['username','nama', 'nama_privilege'];
            $query->where(function($query) use ($field_search, $search){
                foreach ($field_search as $field) {
                    $query->orWhere($field, 'like', "%$search%");
                }
            });
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->join('perusahaans', 'users.id_perusahaan', '=', 'perusahaans.id_perusahaan')
            ->join('privileges','users.id_privilege','=','privileges.id_privilege');
        $query->orderBy('users.created_at','desc');
        $data = $query->paginate($row);
        
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE USER
    public function postUser(){
        $id_perusahaan = $this->input('id_perusahaan', 'required');
        $id_cabang     = $this->input('id_cabang');
        $id_privilege  = $this->input('id_privilege', 'required');
        $username      = $this->input('username', 'required');
        $password      = $this->input('password', 'required');
        $nama          = $this->input('nama', 'required');
        $email_address = $this->input('email_address');
        $status        = 1;
        $keterangan    = $this->input('keterangan');
        if($this->validator()){
            return  $this->validator(true);
        }
        
        #CEK USERNAME EXIST
        $cek = DB::table('users')->where('username','=',$username)->count();
        if($cek > 0){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Username sudah terdafatar.';
            return $respone;
        }

        #UPLOAD FILE
        $config['allowed_type'] = 'jpeg|jpg|png';
        $config['max_size']     = '2048';
        $config['required']     = true;
        $foto          = $this->uploadFile('foto', 'public/img/user_foto', $username, $config);
        if(!$foto['is_uploaded']){
            return $foto['msg'];
        }

        $save['id_perusahaan'] = $id_perusahaan;
        $save['id_cabang']     = $id_cabang;
        $save['id_privilege']  = $id_privilege;
        $save['username']      = $username;
        $save['password']      = Hash::make($password);
        $save['nama']          = $nama;
        $save['email_address'] = $email_address;
        $save['status']        = $status;
        $save['keterangan']    = $keterangan;
        $save['foto']          = $foto['filename'];
        $result = Sideveloper::insert('users', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #STATUS USER
    public function postStatusUser(){
        $id     = $this->input('id', 'required');
        $status = $this->input('status', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['status']        = $status;
        $where = array(['id','=', $id]);
        $result = Sideveloper::update('users', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $msg = $status == 1 ? 'User Berhasil di aktifkan.' :  'User Berhasil di banned.';
            $respone['api_message'] = $msg;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE USER
    public function getUserBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('users')->where('id', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

     #UPDATE USER
     public function postUpdateUser(){
        $id            = $this->input('id', 'required');
        $id_perusahaan = $this->input('id_perusahaan', 'required');
        $id_cabang     = $this->input('id_cabang');
        $id_privilege  = $this->input('id_privilege', 'required');
        $nama          = $this->input('nama', 'required');
        $email_address = $this->input('email_address');
        $username      = $this->input('username');
        $keterangan    = $this->input('keterangan');
        $password      = $this->input('password');
        if($this->validator()){
            return  $this->validator(true);
        }

        #UPLOAD FILE
        $config['allowed_type'] = 'jpeg|jpg|png';
        $config['max_size']     = '2048';
        $config['required']     = false;
        $foto          = $this->uploadFile('foto', 'public/img/user_foto', $username, $config);
        if(!$foto['is_uploaded']){
            return $foto['msg'];
        }
        
        $save['id_perusahaan'] = $id_perusahaan;
        $save['id_cabang']     = $id_cabang;
        $save['id_privilege']  = $id_privilege;
        $save['nama']          = $nama;
        $save['email_address'] = $email_address;
        $save['keterangan']    = $keterangan;
        if($foto['filename'])
        $save['foto'] = $foto['filename'];
        if($password)
        $save['password'] = Hash::make($password);

        $where = array(['id','=', $id]);
        $result = Sideveloper::update('users', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

     #GET DETAIL USER
     public function getDetailUser(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $nama_cabang = DB::raw('(CASE WHEN nama_cabang is null THEN "Seluruh Cabang" ELSE nama_cabang END) AS nama_cabang');
        $data =DB::table('users')
        ->select('id', $nama_cabang,'nama_perusahaan','username','nama','status', 'foto', 'email_address', 'users.keterangan', 'nama_privilege')
        ->leftJoin('cabangs', 'users.id_cabang', '=', 'cabangs.id_cabang')
        ->join('perusahaans','users.id_perusahaan','=','perusahaans.id_perusahaan')
        ->join('privileges','users.id_privilege','=','privileges.id_privilege')
        ->where('id', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    /**
     * MASTER PRIVILEGE
     */

    #READ PRIVILEGE
    public function getPrivilege(){
        $row    = Request::input('row');
        $search = Request::input('search');
        $sort   = Request::input('sort');
        $by     = Request::input('by');
        $query  = DB::table('privileges');
        
        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_privilege'];
            foreach ($field_search as $field) {
                $query->orWhere($field, 'like', "%$search%");
            }
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('created_at','desc');
        $data = $query->paginate($row);
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE PRIVILEGE
    public function postPrivilege(){
        $nama   = $this->input('nama', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_privilege']  = $nama;
        $result = Sideveloper::insert('privileges', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE PRIVILEGE
    public function postDeletePrivilege(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        try {
            $delete = DB::table('privileges')->where('id_privilege', '=', $id);
            $result = Sideveloper::delete('privileges', $delete);

            if($result){
                $respone['api_status']  = 1;
                $respone['api_message'] = 'Data berhasil dihapus.';
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah.';
            }
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data sudah digunakan di master.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE PRIVILEGE
    public function getPrivilegeBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('privileges')->where('id_privilege', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE PRIVILEGE
    public function postUpdatePrivilege(){
        $id     = $this->input('id', 'required');
        $nama   = $this->input('nama', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_privilege']  = $nama;
        $where = array(['id_privilege','=', $id]);
        $result = Sideveloper::update('privileges', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }
    #GET LIST PERMISSION
    public function getListPermission(){
        $id_privilege = $this->input('id_privilege', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }

        $data = DB::table('sub_menus')
            ->select('sub_menus.id_sub_menu', 'sub_menus.id_menu', 'permissions.id_privilege', 'nama_sub_menu', 'nama_menu')
            ->join('menus','sub_menus.id_menu','=','menus.id_menu')
            ->leftJoin('permissions', function ($join) use($id_privilege) {
                $join->on('permissions.id_sub_menu', '=', 'sub_menus.id_sub_menu')
                     ->where('permissions.id_privilege', '=', $id_privilege);
            })
            ->get();
        $old = true;
        foreach($data as $menu){ 
            $list['id_sub_menu']   = $menu->id_sub_menu;
            $list['id_menu'] = $menu->id_menu;
            $list['nama_sub_menu'] = $menu->nama_sub_menu;
            $list['isChecked'] = $menu->id_privilege != null ? true : false;
            $new = $menu->id_privilege != null ? true : false;
            $categories[$menu->id_menu]['nama_menu'] = $menu->nama_menu;
            $categories[$menu->id_menu]['id_menu']   = $menu->id_menu;
            $old = $old * $new;
            $categories[$menu->id_menu]['isChecked']   = $old == 1 ? true : false;
            $categories[$menu->id_menu]['data'][]      = $list;
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success';
        $respone['data']        = array_values($categories);
        return $this->api_output($respone);

    }
    #POST LIST PERMISSION
    public function postListPermission(){
        $id_privilege = $this->input('id', 'required');
        $submenu      = $this->input('submenu');
        $delete = DB::table('permissions')->where('id_privilege', '=', $id_privilege)->delete();
        $save = array();
        if($submenu){
            if(is_array($submenu)){
                foreach($submenu as $key => $c){
                    $save[$key]['id_privilege'] = $id_privilege;
                    $save[$key]['id_sub_menu']       = $c;
                    $save[$key]['updated_at']    = new \DateTime();
                }
            }else{
                $save['id_privilege'] = $id_privilege;
                $save['id_sub_menu']       = $submenu;
                $save['updated_at']    = new \DateTime();
            }
            $result = DB::table('permissions')->insert($save);
            if($result){
                Sideveloper::createLog('UPDATE_TB permissions');
                $respone['api_status']  = 1;
                $respone['api_message'] = 'success';
                $respone['submenu']     = $submenu;
                $respone['save']        = $save;
                return $this->api_output($respone);
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah';
                return $this->api_output($respone);
            }
        }else{
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            return $this->api_output($respone);
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success';
        return $this->api_output($respone);
    }

     /**
     * MASTER MENU
     */

    #READ MENU
    public function getMenu(){
        $row    = Request::input('row');
        $search = Request::input('search');
        $sort   = Request::input('sort');
        $by     = Request::input('by');
        $query  = DB::table('menus');
        
        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_menu','ikon','link'];
            foreach ($field_search as $field) {
                $query->orWhere($field, 'like', "%$search%");
            }
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('urutan','desc');
        $data = $query->paginate($row);
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE MENU
    public function postMenu(){
        $nama_menu = $this->input('nama_menu', 'required');
        $ikon      = $this->input('ikon', 'required');
        $urutan    = $this->input('urutan', 'required');
        $link      = $this->input('link');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_menu'] = $nama_menu;
        $save['ikon']      = $ikon;
        $save['urutan']    = $urutan;
        $save['link']      = $link;
        $result = Sideveloper::insert('menus', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE MENU
    public function postDeleteMenu(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        try {
            $delete = DB::table('menus')->where('id_menu', '=', $id);
            $result = Sideveloper::delete('menus', $delete);

            if($result){
                $respone['api_status']  = 1;
                $respone['api_message'] = 'Data berhasil dihapus.';
            }else{
                $respone['api_status']  = 0;
                $respone['api_message'] = 'Mengalami masalah.';
            }
        } catch (\Illuminate\Database\QueryException $e) {
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data sudah digunakan di master.';
        }
       
        return $this->api_output($respone);
    }

    #GET UPDATE MENU
    public function getMenuBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('menus')->where('id_menu', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE MENU
    public function postUpdateMenu(){
        $id        = $this->input('id', 'required');
        $nama_menu = $this->input('nama_menu', 'required');
        $ikon      = $this->input('ikon', 'required');
        $urutan    = $this->input('urutan', 'required');
        $link      = $this->input('link');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['nama_menu'] = $nama_menu;
        $save['ikon']      = $ikon;
        $save['urutan']    = $urutan;
        $save['link']      = $link;
        $where = array(['id_menu','=', $id]);
        $result = Sideveloper::update('menus', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }

    /**
     * MASTER SUB MENU
     */

    #READ SUB MENU
    public function getSubMenu(){
        
        $row     = Request::input('row');
        $search  = Request::input('search');
        $sort    = Request::input('sort');
        $by      = Request::input('by');
        $id_menu = Request::input('id_menu');

        $query  = DB::table('sub_menus');
        
        $query->where('id_menu','=',$id_menu);

        if(!($search === null || $search === '' || $search ===' ')){
            $field_search = ['nama_sub_menu','link'];
            $query->where(function($query) use ($field_search, $search){
                foreach ($field_search as $field) {
                    $query->orWhere($field, 'like', "%$search%");
                }
            });
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('urutan','desc');
        $data = $query->paginate($row);
        
        if($data->count()>0){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Data Not Found';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #CREATE SUB MENU
    public function postSubMenu(){
        $id_menu       = $this->input('id_menu', 'required');
        $nama_sub_menu = $this->input('nama_sub_menu', 'required|max:100');
        $link          = $this->input('link', 'required|max:100');
        $urutan        = $this->input('urutan', 'required');

        if($this->validator()){
            return  $this->validator(true);
        }
        $save['id_menu']       = $id_menu;
        $save['nama_sub_menu'] = $nama_sub_menu;
        $save['link']          = $link;
        $save['urutan']        = $urutan;
        $result = Sideveloper::insert('sub_menus', $save);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE SUB MENU
    public function postDeleteSubMenu(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $delete = DB::table('sub_menus')->where('id_sub_menu', '=', $id);
        $result = Sideveloper::delete('sub_menus', $delete);

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dihapus.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }
    
    #GET UPDATE SUB MENU
    public function getSubMenuBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('sub_menus')->where('id_sub_menu', '=', $id)->first();
        if($data){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'error';
            $respone['data']        = null;
        }
        return $this->api_output($respone);
    }

    #UPDATE SUB MENU
    public function postUpdateSubMenu(){
        $id            = $this->input('id', 'required');
        $id_menu       = $this->input('id_menu', 'required');
        $nama_sub_menu = $this->input('nama_sub_menu', 'required|max:100');
        $link          = $this->input('link', 'required|max:100');
        $urutan        = $this->input('urutan', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $save['id_menu']       = $id_menu;
        $save['nama_sub_menu'] = $nama_sub_menu;
        $save['link']          = $link;
        $save['urutan']        = $urutan;
        $where = array(['id_sub_menu','=', $id]);
        $result = Sideveloper::update('sub_menus', $save, $where);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil diubah.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
       
        return $this->api_output($respone);
    }
    /**
     * MASTER SUB MENU
     */
    
    #GET DATA TTD
    public function getTtd(){
        $tipe            = $this->input('tipe', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $result = DB::table('ttds')->where('id_ttd', $tipe)->first();
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success.';
            $respone['data'] = $result;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        return $this->api_output($respone);

    }

    #POST DATA TTD
    public function postTtd(){
        $user_1    = $this->input('user_1', 'required');
        $jabatan_1 = $this->input('jabatan_1', 'required');
        $user_2    = $this->input('user_2', 'required');
        $jabatan_2 = $this->input('jabatan_2', 'required');
        $user_3    = $this->input('user_3', 'required');
        $jabatan_3 = $this->input('jabatan_3', 'required');

        if($this->validator()){
            return  $this->validator(true);
        }
        $save_1['user_ttd'] = $user_1;
        $save_1['jabatan']  = $jabatan_1;
        $where_1    = array(['id_ttd','=', 1]);
        $result     = Sideveloper::update('ttds', $save_1, $where_1);

        $save_2['user_ttd'] = $user_2;
        $save_2['jabatan']  = $jabatan_2;
        $where_2    = array(['id_ttd','=', 2]);
        $result     = Sideveloper::update('ttds', $save_2, $where_2);

        $save_3['user_ttd'] = $user_3;
        $save_3['jabatan']  = $jabatan_3;
        $where_3    = array(['id_ttd','=', 3]);
        $result     = Sideveloper::update('ttds', $save_3, $where_3);
        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success.';
            $respone['data'] = $result;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        return $this->api_output($respone);

    }
    #FINSIH
}