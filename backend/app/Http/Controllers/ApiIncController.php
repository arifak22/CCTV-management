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
use JWTAuth;
use Mpdf;
class ApiIncController extends MiddleController
{
    #SAVE INCIDENT
    public function postSave(){
        $id_cabang     = $this->input('id_cabang', 'required|numeric');
        $id_lokasi     = $this->input('id_lokasi', 'required|numeric');
        $id_cctv       = $this->input('id_cctv', 'required|numeric');
        $waktu_start   = $this->input('waktu_start', 'required');
        $waktu_finish  = $this->input('waktu_finish');
        $id_status_inc = $this->input('id_status_inc','required');
        $keterangan    = $this->input('keterangan');
        $perbaikan    = $this->input('perbaikan');
        $foto_before   = $this->input('foto_before');
        $foto_after    = $this->input('foto_after');
        $foto          = $this->input('foto');
        $status        = $this->input('status','required');

        if($status == 2 && $waktu_finish == ''){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Waktu Selesai harus di isi.';
            return $this->api_output($respone);
        }
        if($waktu_finish != '' && $waktu_start > $waktu_finish){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Waktu Selesai harus lebih besar dari waktu incident';
            return $this->api_output($respone);
        }
        if($status == 2 && $perbaikan == ''){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Perbaikan wajib di isi, jika selesai';
            return $this->api_output($respone);
        }
        if($this->validator()){
            return  $this->validator(true);
        }
        $cek = DB::table('incidents')->where('id_cctv','=',$id_cctv)
            ->where("code_inc", "<>", 9)
            ->whereYear('waktu_start','=',substr($waktu_start, 0, 4))
            ->whereMonth('waktu_start','=',substr($waktu_start, 5, 2))
            ->whereDay('waktu_start','=',substr($waktu_start, 8, 2));
        if($cek->count()>0){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Duplikat Data Start Incident.';
            return $this->api_output($respone);
        }
        
        #CREATE DIRECTORY INCIDENT
        $foto      = json_decode($foto);
        $date      = substr($waktu_start, 0, 7);
        $directory = '/public/img/incident/'.$date.'/'.$id_cctv.'/';
        Storage::makeDirectory($directory);
        #UPLOAD FILE
        if($foto_before){
            $bf = substr($foto_before, strpos($foto_before, ",")+1);
            File::put(storage_path(). '/app/'.$directory.'before.png' , base64_decode($bf));
            $foto_before = $directory.'before.png';
        }
        if($foto_after){
            $af = substr($foto_after, strpos($foto_after, ",")+1);
            File::put(storage_path(). '/app/'.$directory.'after.png' , base64_decode($af));
            $foto_after = $directory.'after.png';
        }

        #SAVE INCIDENT
        $save['id_cabang']     = $id_cabang;
        $save['id_lokasi']     = $id_lokasi;
        $save['id_cctv']       = $id_cctv;
        $save['waktu_start']   = $waktu_start;
        $save['waktu_finish']  = $waktu_finish;
        $save['id_status_inc'] = $id_status_inc;
        $save['keterangan']    = $keterangan;
        $save['perbaikan']     = $perbaikan;
        $save['foto_before']   = $foto_before;
        $save['foto_after']    = $foto_after;
        if($waktu_finish == null){
            $save['code_inc']      = 0;
        }else{
            $save['code_inc']      = $status == 2 ? $status : 1;
        }
        $save['user_created'] = JWTAuth::user()->username;
        if($status === '2'){
			$save['finish_at']	= new \DateTime();
            $save['user_finish'] = JWTAuth::user()->username; 
        }
        $result = Sideveloper::insertID('incidents', $save);

        #SAVE HISTORY
        $save_hist['id_inc']         = $result;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = $status;
        $save_hist['keterangan']    = 'New Created';
        $save_hist['id_status_inc'] = $id_status_inc;
        Sideveloper::insert('incident_historys', $save_hist);

        #SAVE FOTO KEGIATAN
        if($foto){
            foreach($foto as $key => $f){
                $base64_str = substr($f->file, strpos($f->file, ",")+1);
                File::put(storage_path(). '/app/'.$directory.'kegiatan-'.$f->id.'.png' , base64_decode($base64_str));
                $file_name = $directory. 'kegiatan-'.$f->id.'.png';

                $save_foto['file']   = $file_name;
                $save_foto['id_inc']  = $result;
                $save_foto['is_use'] = $f->use ? 1 : 0;
                $save_foto['time']   = $waktu_start;
                Sideveloper::insert('incident_fotos', $save_foto);
            }
        }

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #DELETE INCIDENT
    public function postDelete(){
        $id = $this->input('id', 'required|numeric');
        $save['code_inc'] = 9;
        $where  = array(['id_inc','=', $id]);
        $result = Sideveloper::update('incidents', $save, $where);

        #SAVE HISTORY
        $save_hist['id_inc']         = $id;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = 9;
        $save_hist['keterangan']    = 'Deleted';
        Sideveloper::insert('incident_historys', $save_hist);

        #IS DELETE FOTO
        $delete_foto['is_delete'] = 1;
        $where  = array(['id_inc','=', $id]);
        $result = Sideveloper::update('incident_fotos', $delete_foto, $where);

        $respone['api_status']  = 1;
        $respone['api_message'] = 'Data berhasil dihapus.';
        return $this->api_output($respone);
    }

    #GET DETAIL
    public function getDetail(){
        $id = $this->input('id', 'required');
        
        #GET INCIDENT
        $data['incident'] = DB::table('incidents')
            ->select('id_inc', 'nama_cabang', 'nama_lokasi','nama_cctv','kode_cctv', 'waktu_start','waktu_finish',
            'nama_status', 'incidents.keterangan','perbaikan',
            'foto_before','foto_after','code_inc','incidents.created_at',
            'ucreate.nama as nama_created','finish_at','ufinish.nama as nama_finish')
            ->join('cabangs', 'incidents.id_cabang', '=', 'cabangs.id_cabang')
            ->join('lokasis', 'incidents.id_lokasi', '=', 'lokasis.id_lokasi')
            ->join('cctvs','incidents.id_cctv','=','cctvs.id_cctv')
            ->join('incident_master_status','incidents.id_status_inc','=','incident_master_status.id_status_inc')
            ->join('users as ucreate', 'ucreate.username', '=', 'incidents.user_created') 
            ->leftJoin('users as ufinish', 'ufinish.username', '=', 'incidents.user_finish')
            ->where('id_inc','=',$id)
            ->first();

        #GET FOTO
        $data['foto'] = DB::table('incident_fotos')
            ->where('id_inc', '=', $id)->whereNull('is_delete')
            ->orderBy('is_use','desc')
            ->get();

        #GET HISTORY
        $data['history'] = DB::table('incident_historys')->where('id_inc','=',$id)
            ->select('id_inch','incident_historys.created_at','users.foto','nama','status_update', 'nama_status','incident_historys.keterangan')
            ->orderBy('created_at','desc')
            ->join('users', 'users.username', '=', 'incident_historys.user_update') 
            ->join('incident_master_status','incident_historys.id_status_inc','=','incident_master_status.id_status_inc')
            ->get();

        if($data['incident']){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'success';
            $respone['data']        = $data;
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'not found';
        }

        return $this->api_output($respone);
    }

    #GET UPDATE 
    public function getUpdateBy(){
        $id   = $this->input('id', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data['incident']              = DB::table('incidents')->where('id_inc', '=', $id)->first();
        $data['incident']->foto_before = Sideveloper::toBase64(storage_path().'/app'.$data['incident']->foto_before);
        $data['incident']->foto_after  = Sideveloper::toBase64(storage_path().'/app'.$data['incident']->foto_after);
        $foto       = DB::table('incident_fotos')->where('id_inc', '=', $id)->get();
        $data['foto'] = [];
        foreach($foto as $key => $f){
            $data['foto'][$key]['id']   = $f->id_incf;
            $data['foto'][$key]['use']  = $f->is_use == 1 ? true : false;
            $data['foto'][$key]['file'] =  Sideveloper::toBase64(storage_path().'/app'.$f->file);;
        }
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

    #UPDATE INCIDENT
    public function postUpdate(){
        $id            = $this->input('id', 'required|numeric');
        $id_cabang     = $this->input('id_cabang', 'required|numeric');
        $id_lokasi     = $this->input('id_lokasi', 'required|numeric');
        $id_cctv       = $this->input('id_cctv', 'required|numeric');
        $waktu_start   = $this->input('waktu_start', 'required');
        $waktu_finish  = $this->input('waktu_finish');
        $id_status_inc = $this->input('id_status_inc','required');
        $keterangan    = $this->input('keterangan');
        $perbaikan    = $this->input('perbaikan');
        $foto_before   = $this->input('foto_before');
        $foto_after    = $this->input('foto_after');
        $foto          = $this->input('foto');
        $status        = $this->input('status','required');

        if($status == 2 && $waktu_finish == ''){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Waktu Selesai harus di isi.';
            return $this->api_output($respone);
        }

        if($waktu_start > $waktu_finish){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Waktu Selesai harus lebih besar dari waktu incident';
            return $this->api_output($respone);
        }

        if($status == 2 && $perbaikan == ''){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Perbaikan wajib di isi, jika selesai';
            return $this->api_output($respone);
        }

        if($this->validator()){
            return  $this->validator(true);
        }
        $cek = DB::table('incidents')->where('id_cctv','=',$id_cctv)
            ->where("code_inc", "<>", 9)
            ->where('id_inc', '<>', $id)
            ->whereYear('waktu_start','=',substr($waktu_start, 0, 4))
            ->whereMonth('waktu_start','=',substr($waktu_start, 5, 2))
            ->whereDay('waktu_start','=',substr($waktu_start, 8, 2));
        if($cek->count()>0){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Duplikat Data Start Incident.';
            return $this->api_output($respone);
        }
        
        #CREATE DIRECTORY INCIDENT
        $foto      = json_decode($foto);
        $date      = substr($waktu_start, 0, 7);
        $directory = '/public/img/incident/'.$date.'/'.$id_cctv.'/';
        Storage::makeDirectory($directory);
        #UPLOAD FILE
        if($foto_before){
            $bf = substr($foto_before, strpos($foto_before, ",")+1);
            File::put(storage_path(). '/app/'.$directory.'before.png' , base64_decode($bf));
            $foto_before = $directory.'before.png';
        }
        if($foto_after){
            $af = substr($foto_after, strpos($foto_after, ",")+1);
            File::put(storage_path(). '/app/'.$directory.'after.png' , base64_decode($af));
            $foto_after = $directory.'after.png';
        }

        #UPDATE INCIDENT
        $save['id_cabang']     = $id_cabang;
        $save['id_lokasi']     = $id_lokasi;
        $save['id_cctv']       = $id_cctv;
        $save['waktu_start']   = $waktu_start;
        $save['waktu_finish']  = $waktu_finish;
        $save['id_status_inc'] = $id_status_inc;
        $save['keterangan']    = $keterangan;
        $save['perbaikan']     = $perbaikan;
        $save['foto_before']   = $foto_before;
        $save['foto_after']    = $foto_after;
        if($waktu_finish == null){
            $save['code_inc']      = 0;
        }else{
            $save['code_inc']      = $status == 2 ? $status : 1;
        }
        if($status === '2'){
			$save['finish_at']	= new \DateTime();
            $save['user_finish'] = JWTAuth::user()->username; 
        }
        $where = array(['id_inc','=', $id]);
        $result = Sideveloper::update('incidents', $save, $where);

        #SAVE HISTORY
        $save_hist['id_inc']         = $id;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = $status;
        $save_hist['keterangan']    = 'Updated';
        $save_hist['id_status_inc'] = $id_status_inc;
        Sideveloper::insert('incident_historys', $save_hist);

        #REMOVE OLD FOTO KEGIATAN
        $old_foto = DB::table('incident_fotos')->where('id_inc','=',$id)->get()->toArray();
        $todelete = array_column($old_foto,'file');
        Storage::delete($todelete);
        $delete = DB::table('incident_fotos')->where('id_inc', '=', $id)->delete();

        #SAVE FOTO KEGIATAN
        if($foto){
            foreach($foto as $key => $f){
                $base64_str = substr($f->file, strpos($f->file, ",")+1);
                File::put(storage_path(). '/app/'.$directory.'kegiatan-'.$f->id.'.png' , base64_decode($base64_str));
                $file_name = $directory. 'kegiatan-'.$f->id.'.png';

                $save_foto['file']   = $file_name;
                $save_foto['id_inc']  = $id;
                $save_foto['is_use'] = $f->use ? 1 : 0;
                $save_foto['time']   = $waktu_start;
                Sideveloper::insert('incident_fotos', $save_foto);
            }
        }

        if($result){
            $respone['api_status']  = 1;
            $respone['api_message'] = 'Data berhasil dimasukan.';
        }else{
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Mengalami masalah.';
        }
        
        return $this->api_output($respone);
    }

    #READ LIST
    public function getList(){
        $row        = Request::input('row');
        $search     = Request::input('search');
        $sort       = Request::input('sort');
        $by         = Request::input('by');
        $status     = Request::input('status');
        #report value
        $tipe       = Request::input('tipe');
        $cabang     = Request::input('cabang');
        $bulan      = Request::input('bulan');
        $tgl_start  = Request::input('tgl_start');
        $tgl_finish = Request::input('tgl_finish');
        $bulan = $tipe == 'bulan' ? $bulan : array(date($tgl_start),date($tgl_finish));
        $query  = Sideveloper::getListINC($status, $tipe, $cabang, $bulan);
        if(!($search === null || $search === '' || $search ===' ')){
            if($status=='0'){
                $field_search = ['kode_cctv','nama_cctv', 'waktu_start'];
            }else{
                $field_search = ['kode_cctv','nama_cctv', 'waktu_start', 'waktu_finish','ufinish.nama'];
            }
            $query->where(function($query) use ($field_search, $search){
                foreach ($field_search as $field) {
                    $query->orWhere($field, 'like', "%$search%");
                }
            });
        }
        if(!($sort === null || $sort === '' || $sort ===' ')){
            $query->orderBy($by, $sort == 1 ? 'asc' : 'desc');
        }
        $query->orderBy('incidents.waktu_start','desc');
        
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

    #EXPORT REPORT
    public function getExportReport(){
        $mpdfConfig = array(
            'mode' => 'utf-8', 
            'format' => 'A4',
            'margin_top' => 45,     // 30mm not pixel
            'orientation' => 'L'    
        );
        $mpdf = new mpdf\mPDF($mpdfConfig);
        #report value
        $tipe       = Request::input('tipe');
        $cabang     = Request::input('cabang');
        $bulan      = Request::input('bulan');
        $tgl_start  = Request::input('tgl_start');
        $tgl_finish = Request::input('tgl_finish');

        #WAKTU TITLE
        if($tipe == 'bulan'){
            $data['date']  = strtoupper(Sideveloper::bulan(Sideveloper::getBulan($bulan))) . ' ' . Sideveloper::getTahun($bulan);
        }else{
            $data['date'] = $tgl_start. ' s.d ' .$tgl_finish;
            $bulan = array(date($tgl_start), date($tgl_finish));
        }

        #GET DATA
        $list  = Sideveloper::getListINC(2, $tipe, $cabang, $bulan)
            ->orderBy('incidents.waktu_finish','asc')
            ->get();

        #MAKE DATA
        $makeData = null;
        $jml_row = 1;
        $k = 0;
        $j = 0;
        foreach($list as $key => $l){
            if(Sideveloper::getFullDate($l->waktu_finish) == @Sideveloper::getFullDate($list[$key+1]->waktu_finish)){
                $makeData[$k]['rows'] = $jml_row;
                $makeData[$k]['data'][$j++] = $l;
                $jml_row++;
            }else{
                $makeData[$k]['rows'] = $jml_row;
                $makeData[$k]['data'][$j++] = $l;
                $k++;
                $j = 0;
                $jml_row = 1;
            }
        }
        // print_r($makeData);die();
        $data['data'] = $makeData; 
        //HEADER
        $htmlHeader = view('pdf/header')->render();
        $mpdf->SetHTMLHeader($htmlHeader);
        
        //TTD
        $data['ttd_1'] = DB::table('ttds')
            ->select('nama','jabatan')
            ->join('users','ttds.user_ttd','=','users.username')
            ->where('tipe', 1)->first();
        $data['ttd_2'] = DB::table('ttds')
            ->select('nama','jabatan')
            ->join('users','ttds.user_ttd','=','users.username')
            ->where('tipe', 2)->limit(2)->get();

        //ISIAN
        $html = view('pdf/inc-report', $data)->render();
        $mpdf->WriteHTML($html);

        $filename = strtotime(date('Y-m-d H:i:s'));
        $mpdf->Output(storage_path(). '/app/public/pdf/'.$filename.'.pdf', \Mpdf\Output\Destination::FILE);
        $path = Sideveloper::baseUrl('storage/app/public/pdf/'.$filename.'.pdf');
        return $this->api_output(array('path'=>$path));
    }

    #EXPORT LAMPIRAN
    public function getExportLampiran(){
        $mpdfConfig = array(
            'mode' => 'utf-8', 
            'format' => 'A4',
            'margin_top' => 40,     // 30mm not pixel
            'orientation' => 'P'    
        );
        $mpdf = new mpdf\mPDF($mpdfConfig);
        #report value
        $tipe       = Request::input('tipe');
        $cabang     = Request::input('cabang');
        $bulan      = Request::input('bulan');
        $tgl_start  = Request::input('tgl_start');
        $tgl_finish = Request::input('tgl_finish');
        #WAKTU TITLE
        if($tipe == 'bulan'){
            $data['date']  = strtoupper(Sideveloper::bulan(Sideveloper::getBulan($bulan))) . ' ' . Sideveloper::getTahun($bulan);
        }else{
            $data['date'] = $tgl_start. ' s.d ' .$tgl_finish;
            $bulan = array(date($tgl_start), date($tgl_finish));
        }
        #GET DATA
        $d  = Sideveloper::getListINC(2, $tipe, $cabang, $bulan)
        ->orderBy('incidents.waktu_finish','asc');
        $data['count'] = $d->count();
        $data['data']  = $d->get();
        
        //HEADER
        $htmlHeader = view('pdf/header')->render();
        $mpdf->SetHTMLHeader($htmlHeader);
        
        //ISIAN
        $html = view('pdf/inc-lampiran', $data)->render();
        $mpdf->WriteHTML($html);

        $filename = strtotime(date('Y-m-d H:i:s'));
        $mpdf->Output(storage_path(). '/app/public/pdf/'.$filename.'.pdf', \Mpdf\Output\Destination::FILE);
        $path = Sideveloper::baseUrl('storage/app/public/pdf/'.$filename.'.pdf');
        return $this->api_output(array('path'=>$path));
    }
}