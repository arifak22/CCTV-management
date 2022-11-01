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
class ApiMtController extends MiddleController
{
    #SAVE MAINTENANCE
    public function postSave(){
        $id_cabang     = $this->input('id_cabang', 'required|numeric');
        $id_lokasi     = $this->input('id_lokasi', 'required|numeric');
        $id_cctv       = $this->input('id_cctv', 'required|numeric');
        $waktu         = $this->input('waktu', 'required');
        $view_kegiatan = $this->input('view_kegiatan', 'required');
        $select        = $this->input('kegiatan_select');
        $text          = $this->input('kegiatan_text');
        $kegiatan      = $view_kegiatan === 'select' ? $select : $text;
        $foto_before   = $this->input('foto_before');
        $foto_after    = $this->input('foto_after');
        $foto          = $this->input('foto');
        $status        = $this->input('status','required');

        if($kegiatan == null){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Kegiatan wajib di isi.';
            return $this->api_output($respone);
        }

        if($this->validator()){
            return  $this->validator(true);
        }
        $cek = DB::table('maintenances')->where('id_cctv','=',$id_cctv)
            ->where("code_mt", "<>", 9)
            ->whereYear('waktu','=',substr($waktu, 0, 4))
            ->whereMonth('waktu','=',substr($waktu, 5, 2));
        if($cek->count()>0){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'CCTV sudah di maintenance pada Bulan tersebut.';
            return $this->api_output($respone);
        }
        
        #CREATE DIRECTORY MAINTENANCE
        $foto      = json_decode($foto);
        $date      = substr($waktu, 0, 7);
        $directory = '/public/img/maintenances/'.$date.'/'.$id_cctv.'/';
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

        #CREATE SYSCODE, JIKA BARU
        if($view_kegiatan === 'text'){
            $save_sys['code']      = 'KG';
            $save_sys['value']     = $kegiatan;
            $save_sys['deskripsi'] = $kegiatan;
            Sideveloper::insert('syscodes', $save_sys);
        }

        #SAVE MAINTENANCE
        $save['id_cabang']    = $id_cabang;
        $save['id_lokasi']    = $id_lokasi;
        $save['id_cctv']      = $id_cctv;
        $save['waktu']        = $waktu;
        $save['kegiatan']     = $kegiatan;
        $save['foto_before']  = $foto_before;
        $save['foto_after']   = $foto_after;
        $save['code_mt']      = $status;
        $save['user_created'] = JWTAuth::user()->username;
        if($status === '1'){
			$save['finish_at']	= new \DateTime();
            $save['user_finish'] = JWTAuth::user()->username; 
        }
        $result = Sideveloper::insertID('maintenances', $save);

        #SAVE HISTORY
        $save_hist['id_mt']         = $result;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = $status;
        $save_hist['keterangan']    = 'New Created';
        Sideveloper::insert('maintenance_historys', $save_hist);

        #SAVE FOTO KEGIATAN
        if($foto){
            foreach($foto as $key => $f){
                $base64_str = substr($f->file, strpos($f->file, ",")+1);
                File::put(storage_path(). '/app/'.$directory.'kegiatan-'.$f->id.'.png' , base64_decode($base64_str));
                $file_name = $directory. 'kegiatan-'.$f->id.'.png';

                $save_foto['file']   = $file_name;
                $save_foto['id_mt']  = $result;
                $save_foto['is_use'] = $f->use ? 1 : 0;
                $save_foto['time']   = $waktu;
                Sideveloper::insert('maintenance_fotos', $save_foto);
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

    #DELETE MAINTENANCE
    public function postDelete(){
        $id = $this->input('id', 'required|numeric');
        $save['code_mt'] = 9;
        $where  = array(['id_mt','=', $id]);
        $result = Sideveloper::update('maintenances', $save, $where);

        #SAVE HISTORY
        $save_hist['id_mt']         = $id;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = 9;
        $save_hist['keterangan']    = 'Deleted';
        Sideveloper::insert('maintenance_historys', $save_hist);

        #IS DELETE FOTO
        $delete_foto['is_delete'] = 1;
        $where  = array(['id_mt','=', $id]);
        $result = Sideveloper::update('maintenance_fotos', $delete_foto, $where);

        $respone['api_status']  = 1;
        $respone['api_message'] = 'Data berhasil dihapus.';
        return $this->api_output($respone);
    }

    #GET DETAIL
    public function getDetail(){
        $id = $this->input('id', 'required');
        
        #GET MAINTENANCE
        $data['maintenance'] = DB::table('maintenances')
            ->select('id_mt', 'nama_cabang', 'nama_lokasi','nama_cctv','kode_cctv', 'waktu',
            'kegiatan','foto_before','foto_after','code_mt','maintenances.created_at',
            'ucreate.nama as nama_created','finish_at','ufinish.nama as nama_finish')
            ->join('cabangs', 'maintenances.id_cabang', '=', 'cabangs.id_cabang')
            ->join('lokasis', 'maintenances.id_lokasi', '=', 'lokasis.id_lokasi')
            ->join('cctvs','maintenances.id_cctv','=','cctvs.id_cctv')
            ->join('users as ucreate', 'ucreate.username', '=', 'maintenances.user_created') 
            ->leftJoin('users as ufinish', 'ufinish.username', '=', 'maintenances.user_finish')
            ->where('id_mt','=',$id)
            ->first();

        #GET FOTO
        $data['foto'] = DB::table('maintenance_fotos')
            ->where('id_mt', '=', $id)->whereNull('is_delete')
            ->orderBy('is_use','desc')
            ->get();

        #GET HISTORY
        $data['history'] = DB::table('maintenance_historys')->where('id_mt','=',$id)
            ->select('id_mth','maintenance_historys.created_at','users.foto','nama','status_update','maintenance_historys.keterangan')
            ->orderBy('created_at','desc')
            ->join('users', 'users.username', '=', 'maintenance_historys.user_update') 
            ->get();

        if($data['maintenance']){
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
        $data['maintenance']              = DB::table('maintenances')->where('id_mt', '=', $id)->first();
        $data['maintenance']->foto_before = Sideveloper::toBase64(storage_path().'/app'.$data['maintenance']->foto_before);
        $data['maintenance']->foto_after  = Sideveloper::toBase64(storage_path().'/app'.$data['maintenance']->foto_after);
        $foto       = DB::table('maintenance_fotos')->where('id_mt', '=', $id)->get();
        $data['foto'] = [];
        foreach($foto as $key => $f){
            $data['foto'][$key]['id']   = $f->id_mtf;
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

    #UPDATE MAINTENANCE
    public function postUpdate(){
        $id            = $this->input('id', 'required|numeric');
        $id_cabang     = $this->input('id_cabang', 'required|numeric');
        $id_lokasi     = $this->input('id_lokasi', 'required|numeric');
        $id_cctv       = $this->input('id_cctv', 'required|numeric');
        $waktu         = $this->input('waktu', 'required');
        $view_kegiatan = $this->input('view_kegiatan', 'required');
        $select        = $this->input('kegiatan_select');
        $text          = $this->input('kegiatan_text');
        $kegiatan      = $view_kegiatan === 'select' ? $select : $text;
        $foto_before   = $this->input('foto_before');
        $foto_after    = $this->input('foto_after');
        $foto          = $this->input('foto');
        $status        = $this->input('status','required');

        if($kegiatan == null){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'Kegiatan wajib di isi.';
            return $this->api_output($respone);
        }

        if($this->validator()){
            return  $this->validator(true);
        }
        $cek = DB::table('maintenances')->where('id_cctv','=',$id_cctv)
            ->where('id_mt', '<>', $id)
            ->where("code_mt", "<>", 9)
            ->whereYear('waktu','=',substr($waktu, 0, 4))
            ->whereMonth('waktu','=',substr($waktu, 5, 2));
        if($cek->count()>0){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'CCTV sudah di maintenance pada Bulan tersebut.';
            return $this->api_output($respone);
        }
        
        #CREATE DIRECTORY MAINTENANCE
        $foto      = json_decode($foto);
        $date      = substr($waktu, 0, 7);
        $directory = '/public/img/maintenances/'.$date.'/'.$id_cctv.'/';
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

        #CREATE SYSCODE, JIKA BARU
        if($view_kegiatan === 'text'){
            $save_sys['code']      = 'KG';
            $save_sys['value']     = $kegiatan;
            $save_sys['deskripsi'] = $kegiatan;
            Sideveloper::insert('syscodes', $save_sys);
        }

        #UPDATE MAINTENANCE
        $save['id_cabang']    = $id_cabang;
        $save['id_lokasi']    = $id_lokasi;
        $save['id_cctv']      = $id_cctv;
        $save['waktu']        = $waktu;
        $save['kegiatan']     = $kegiatan;
        $save['foto_before']  = $foto_before;
        $save['foto_after']   = $foto_after;
        $save['code_mt']      = $status;
        if($status === '1'){
			$save['finish_at']	= new \DateTime();
            $save['user_finish'] = JWTAuth::user()->username; 
        }
        $where = array(['id_mt','=', $id]);
        $result = Sideveloper::update('maintenances', $save, $where);

        #SAVE HISTORY
        $save_hist['id_mt']         = $id;
        $save_hist['user_update']   = JWTAuth::user()->username;
        $save_hist['status_update'] = $status;
        $save_hist['keterangan']    = 'Updated';
        Sideveloper::insert('maintenance_historys', $save_hist);

        #REMOVE OLD FOTO KEGIATAN
        $old_foto = DB::table('maintenance_fotos')->where('id_mt','=',$id)->get()->toArray();
        $todelete = array_column($old_foto,'file');
        Storage::delete($todelete);
        $delete = DB::table('maintenance_fotos')->where('id_mt', '=', $id)->delete();

        #SAVE FOTO KEGIATAN
        if($foto){
            foreach($foto as $key => $f){
                $base64_str = substr($f->file, strpos($f->file, ",")+1);
                File::put(storage_path(). '/app/'.$directory.'kegiatan-'.$f->id.'.png' , base64_decode($base64_str));
                $file_name = $directory. 'kegiatan-'.$f->id.'.png';

                $save_foto['file']   = $file_name;
                $save_foto['id_mt']  = $id;
                $save_foto['is_use'] = $f->use ? 1 : 0;
                $save_foto['time']   = $waktu;
                Sideveloper::insert('maintenance_fotos', $save_foto);
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
        $query  = Sideveloper::getListMT($status, $tipe, $cabang, $bulan);
        if(!($search === null || $search === '' || $search ===' ')){
            if($status=='1'){
                $field_search = ['kode_cctv','nama_cctv', 'waktu','ufinish.nama'];
            }else{
                $field_search = ['kode_cctv','nama_cctv', 'waktu'];
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
        $query->orderBy('maintenances.waktu','desc');
        
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
        $list  = Sideveloper::getListMT(1, $tipe, $cabang, $bulan)
            ->orderBy('maintenances.waktu','asc')
            ->get();

        #MAKE DATA
        $makeData = null;
        $jml_row = 1;
        $k = 0;
        $j = 0;
        foreach($list as $key => $l){
            if(Sideveloper::getFullDate($l->waktu) == @Sideveloper::getFullDate($list[$key+1]->waktu)){
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
        $data['data'] = $makeData; 
        //HEADER
        $htmlHeader = view('pdf/header')->render();
        $mpdf->SetHTMLHeader($htmlHeader);

        // //FOOTER
        // $htmlFooter = view('pdf/footer')->render();
        // $mpdf->SetHTMLFooter($htmlFooter);
        
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
        $html = view('pdf/mt-report', $data)->render();
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
        $d  = Sideveloper::getListMT(1, $tipe, $cabang, $bulan)
        ->orderBy('maintenances.waktu','asc');
        $data['count'] = $d->count();
        $data['data']  = $d->get();
        
        //HEADER
        $htmlHeader = view('pdf/header')->render();
        $mpdf->SetHTMLHeader($htmlHeader);
        
        //ISIAN
        $html = view('pdf/mt-lampiran', $data)->render();
        $mpdf->WriteHTML($html);

        $filename = strtotime(date('Y-m-d H:i:s'));
        $mpdf->Output(storage_path(). '/app/public/pdf/'.$filename.'.pdf', \Mpdf\Output\Destination::FILE);
        $path = Sideveloper::baseUrl('storage/app/public/pdf/'.$filename.'.pdf');
        return $this->api_output(array('path'=>$path));
    }
}