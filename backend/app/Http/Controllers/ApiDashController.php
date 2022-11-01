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
class ApiDashController extends MiddleController
{
    #GET CARD KETERANGAN DASHBOARD
    public function getCard(){
        $cctv = DB::table('cctvs')->where('status', 1)->count();
        $incident = DB::table('incidents')->whereNull('waktu_finish')
                ->join('incident_master_status', 'incidents.id_status_inc','=','incident_master_status.id_status_inc')
                ->where('kode','<>', '1')->count();
        $rusak = DB::table('incidents')->whereNull('waktu_finish')
                ->join('incident_master_status', 'incidents.id_status_inc','=','incident_master_status.id_status_inc')
                ->where('kode', '1')
                ->count();
        $mt   = DB::table('maintenances')->whereYear('waktu', date('Y'))->whereMonth('waktu', date('m'))->count();
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success.';
        $respone['data'] = ['cctv'=>$cctv, 'incident'=>$incident, 'rusak' => $rusak, 'mt'=>$mt];
        return $this->api_output($respone);
    }

    #READ LIST INCIDENT
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
                $field_search = ['kode_cctv','nama_cctv', 'waktu_start', 'nama_status', 'incidents.keterangan'];
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

}