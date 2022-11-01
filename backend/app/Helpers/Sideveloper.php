<?php
/** DEV
 * ARIF KURNIAWAN
 * arif@sideveloper.com
 * 08985565211
 * www.sideveloper.com
 * Created At: Mei 2020
 */
	namespace App\Helpers;
	
	use App;
	use Cache;
	use Config;
	use DB;
	use Excel;
	use File;
	use Hash;
	use Log;
	use Mail;
	use PDF;
	use Request;
	use Route;
	use Session;
	use Storage;
	use Schema;
	use Validator;
	use Auth;
	
	class Sideveloper
	{
		#ROUTING
        public static function routeController($prefix, $controller, $token = false, $namespace = null)
		{
			
			$prefix = trim($prefix, '/') . '/';
			
			$namespace = ($namespace) ?: 'App\Http\Controllers';
			
			try {
				Route::get($prefix, ['uses' => $controller . '@getIndex', 'as' => $controller . 'GetIndex']);
				
				$controller_class = new \ReflectionClass($namespace . '\\' . $controller);
				$controller_methods = $controller_class->getMethods(\ReflectionMethod::IS_PUBLIC);
				$wildcards = '/{one?}/{two?}/{three?}/{four?}/{five?}';
				foreach ($controller_methods as $method) {
					if ($method->class != 'Illuminate\Routing\Controller' && $method->name != 'getIndex') {
						if (substr($method->name, 0, 3) == 'get') {
							$method_name = substr($method->name, 3);
							$slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
							$slug = strtolower(implode('-', $slug));
							$slug = ($slug == 'index') ? '' : $slug;
							if($token){
								Route::get($prefix . $slug . $wildcards, ['uses' => $controller . '@' . $method->name, 'as' => $controller . 'Get' . $method_name]);
							}else{
								Route::get($prefix . $slug . $wildcards, ['uses' => $controller . '@' . $method->name, 'as' => $controller . 'Get' . $method_name]);
							}
						} elseif (substr($method->name, 0, 4) == 'post') {
							$method_name = substr($method->name, 4);
							$slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
							if($token){
								Route::post($prefix . strtolower(implode('-', $slug)) . $wildcards, [
									'uses' => $controller . '@' . $method->name,
									'as' => $controller . 'Post' . $method_name,
								]);
							}else{
								Route::post($prefix . strtolower(implode('-', $slug)) . $wildcards, [
									'uses' => $controller . '@' . $method->name,
									'as' => $controller . 'Post' . $method_name,
								]);
							}
						}
					}
				}
			} catch (\Exception $e) {
			
			}
		}

		#TO BASE64
		public static function toBase64($path){
			$type = pathinfo($path, PATHINFO_EXTENSION);
			if($type){
				$aa = file_get_contents($path);
				$base64 = 'data:image/' . $type . ';base64,' . base64_encode($aa);
				return $base64;
			}else{
				return null;
			}
		}

		#BASE URL
		public static function baseUrl($path=''){
			return 'http://localhost/MJC/backend/' . $path;
		}

		#VALIDASI
		public static function Validator($data = [])
		{
			
			$validator = Validator::make(Request::all(), $data);
			if ($validator->fails()) {
				$result = array();
				$message = $validator->errors();
				$result['api_status'] = 0;
				$result['api_code'] = 401;
				$result['api_message'] = $message;
				// $result['api_message'] = $message->all(':message')[0];
				$res = response()->json($result);
				return $res->send();
			}
		}
		

		#REQUEST & VALIDASI
		public static function Input($name = null, $rule = []){
			$rule =  array($name => $rule);
			$validator = Validator::make(Request::all(), $rule);
			if ($validator->fails()) {
				$result = array();
				$message = $validator->errors();
				$result['api_status'] = 0;
				$result['api_code'] = 401;
				$result['api_message'] = $message;
				// $result['api_message'] = $message->all(':message')[0];
				$res = response()->json($result);
				$res->send();
				exit;
			}
		}

		public static function insert($table, $save){
			$save['created_at']	= new \DateTime();
			$result = DB::table($table)->insert($save);
			if($result){
				self::createLog('CREATE_TB '.$table);
				return $result;
			}
			return false;
		}
		public static function insertID($table, $save){
			$save['created_at']	= new \DateTime();
			$result = DB::table($table)->insertGetId($save);
			if($result){
				self::createLog('CREATE_TB '.$table);
				return $result;
			}
			return false;
		}
		public static function delete($note, $data){
			$temp = json_encode($data->first());
			$result = $data->delete();
			if($result){
				self::createLog('DELETE_TB '.$note, $temp);
				return true;
			}
			return $result;
		}
		public static function update($table, $save, $parameter){
			$temp = DB::table($table)->where($parameter)->first();
			$temp = json_encode($temp);
			$save['updated_at']	= new \DateTime();
			$result = DB::table($table)->where($parameter)->update($save);
			if($result){
				self::createLog('UPDATE_TB '.$table, $temp);
				return true;
			}
			return false;
		}
		public static function createLog($errors, $note = null,  $type = 'info'){
			$ip      = Request::ip();
			$input   = json_encode(Request::input());
			$url     = Request::url();
			$message = is_array($errors) ? json_encode($errors) : $errors;
			$user    = Auth::user() ? Auth::user()->username : '';
			$method  = Request::getMethod();
			$text    = "[IP: ". $ip. "] [USER: ".$user."] [URL: ".$url."] [METHOD: ".$method."] [PARAMETER: ".$input."] [MESSAGE: ".$message."] [KETERANGAN: ".$note."]";

			switch ($type) {
				case 'info':
					Log::info($text);
					break;

				case 'emergency':
					Log::emergency($text);
					break;
					
				case 'alert':
					Log::alert($text);
					break;

				case 'critical':
					Log::critical($text);
					break;

				case 'error':
					Log::error($text);
				break;

				case 'warning':
					Log::warning($text);
					break;

				case 'notice':
					Log::notice($text);
					break;
					
				case 'debug':
					Log::debug($text);
					break;
				default:
					# code...
					break;
			}
		}

		/**
		 * DATE
		 */

		public static function dateFormat($date, $format = 'Y-m-d H:i:s'){
			return date($format, strtotime($date));
		}

		public static function getFullDate($date){
			date_default_timezone_set('Asia/Jakarta');
            $tanggal = self::getTanggal($date);
            $bulan   = self::bulan(self::getBulan($date));
            $tahun   = self::getTahun($date);
            return self::hari($tanggal) .', '.$tanggal.' '.$bulan.' '.$tahun;  
		}

		public static function getTanggal($date){
			return substr($date,8,2);
		}

		public static function getBulan($date){
			return substr($date,5,2);
		}
		public static function getTahun($date){
			return substr($date,0,4);
		}

		public static function getHour($date){
			return substr($date, 11,5);
		}

		public static function hari($date){
			$hari = date('D', strtotime($date));
			switch ($hari) {
				case 'Sun':
					return 'Minggu';
					break;
				case 'Mon':
					return 'Senin';
					break;
				case 'Tue':
					return 'Selasa';
					break;
				case 'Wed':
					return 'Rabu';
					break;
				case 'Thu':
					return 'Kamis';
					break;
				case 'Fri':
					return 'Jumat';
					break;
				case 'Sat':
					return 'Sabtu';
					break;
			}
		}
		public static function bulan($bln){
			switch ($bln){
				case 1: 
					return "Januari";
					break;
				case 2:
					return "Februari";
					break;
				case 3:
					return "Maret";
					break;
				case 4:
					return "April";
					break;
				case 5:
					return "Mei";
					break;
				case 6:
					return "Juni";
					break;
				case 7:
					return "Juli";
					break;
				case 8:
					return "Agustus";
					break;
				case 9:
					return "September";
					break;
				case 10:
					return "Oktober";
					break;
				case 11:
					return "November";
					break;
				case 12:
					return "Desember";
					break;
			}
		} 



		/**
		 * 
		 * MODEL
		 */

		public static function getListMT($status, $tipe, $cabang, $bulan){
			$query = DB::table('maintenances')
			->select('id_mt','nama_lokasi','kode_cctv','nama_cctv','waktu','kegiatan','code_mt',
			'maintenances.created_at','ucreate.nama AS created_name','ufinish.nama AS finish_name',
			'foto_before', 'foto_after',
			'finish_at');
			$query->join('lokasis', 'maintenances.id_lokasi', '=', 'lokasis.id_lokasi')
				->join('cctvs','maintenances.id_cctv','=','cctvs.id_cctv')
				->join('users as ucreate', 'ucreate.username', '=', 'maintenances.user_created') 
				->leftJoin('users as ufinish', 'ufinish.username', '=', 'maintenances.user_finish');
			if($tipe === 'bulan'){
				if($cabang != '')
				$query->where('maintenances.id_cabang', '=',$cabang);
	
				$query->whereYear('waktu','=',substr($bulan, 0, 4));
				$query->whereMonth('waktu','=',substr($bulan, 5, 2));
			}else if($tipe === 'hari'){
				$query->whereBetween('waktu', $bulan);
			}
			if(!($status === null || $status === '' || $status ===' ')){
				$query->where('maintenances.code_mt','=',$status);
			}
			$query->whereNull('maintenances.deleted_at');
			return $query;
		}
		public static function getListINC($status, $tipe, $cabang, $bulan){
			$query = DB::table('incidents')
			->select('id_inc','nama_lokasi','kode_cctv','nama_cctv','waktu_start','waktu_finish','code_inc',
			'incidents.created_at','ucreate.nama AS created_name','ufinish.nama AS finish_name',
			'foto_before', 'foto_after', 'incidents.keterangan', 'nama_status', 'perbaikan',
			'finish_at');
			$query->join('lokasis', 'incidents.id_lokasi', '=', 'lokasis.id_lokasi')
				->join('cctvs','incidents.id_cctv','=','cctvs.id_cctv')
				->join('incident_master_status','incidents.id_status_inc','=','incident_master_status.id_status_inc')
				->join('users as ucreate', 'ucreate.username', '=', 'incidents.user_created') 
				->leftJoin('users as ufinish', 'ufinish.username', '=', 'incidents.user_finish');
			if($tipe === 'bulan'){
				if($cabang != '')
				$query->where('incidents.id_cabang', '=',$cabang);
	
				$query->whereYear('waktu_finish','=',substr($bulan, 0, 4));
				$query->whereMonth('waktu_finish','=',substr($bulan, 5, 2));
			}else if($tipe === 'hari'){
				$query->whereBetween('waktu_finish', $bulan);
			}
			if(!($status === null || $status === '' || $status ===' ')){
				$query->where('incidents.code_inc','=',$status);

			}
			$query->whereNull('incidents.deleted_at');
			return $query;
		}

		public static function getListDaily(){
			$data = DB::table('dailys')
				->select('periode','last_refreshed','dailys.id_cctv','kode_cctv', 'ip', 'id_merk','nama_lokasi', 'kode_lokasi','nama_cctv',
				'tgl_1','tgl_2','tgl_3','tgl_4','tgl_5','tgl_6','tgl_7','tgl_8','tgl_9','tgl_10',
				'tgl_11','tgl_12','tgl_13','tgl_14','tgl_15','tgl_16','tgl_17','tgl_18','tgl_19','tgl_20',
				'tgl_21','tgl_22','tgl_23','tgl_24','tgl_25','tgl_26','tgl_27','tgl_28','tgl_29','tgl_30','tgl_31')
				->join('cctvs', 'cctvs.id_cctv','=','dailys.id_cctv')
				->join('lokasis', 'cctvs.id_lokasi','=','lokasis.id_lokasi')
				->orderBy('dailys.id_cabang')
				->orderBy('nama_lokasi')
				->orderBy('nama_cctv');
			return $data;
		}

		public static function getListRealisasi(){
			$data = DB::table('realisasis')
				->select('periode','last_refreshed','realisasis.id_cctv','kode_cctv', 'ip', 'id_merk','nama_lokasi', 'kode_lokasi','nama_cctv',
				'tgl_1','tgl_2','tgl_3','tgl_4','tgl_5','tgl_6','tgl_7','tgl_8','tgl_9','tgl_10',
				'tgl_11','tgl_12','tgl_13','tgl_14','tgl_15','tgl_16','tgl_17','tgl_18','tgl_19','tgl_20',
				'tgl_21','tgl_22','tgl_23','tgl_24','tgl_25','tgl_26','tgl_27','tgl_28','tgl_29','tgl_30','tgl_31')
				->join('cctvs', 'cctvs.id_cctv','=','realisasis.id_cctv')
				->join('lokasis', 'cctvs.id_lokasi','=','lokasis.id_lokasi')
				->orderBy('realisasis.id_cabang')
				->orderBy('nama_lokasi')
				->orderBy('nama_cctv');
			return $data;
		}
    }