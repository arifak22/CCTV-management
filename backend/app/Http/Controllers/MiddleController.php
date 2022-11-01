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

class MiddleController extends Controller
{
    public $validator = [];
    public $valid     = true;
    public $respone   = null;
    
    public function input($name, $rule = null){
        $rule && $this->validator[$name] = $rule;
        return Request::input($name);
    }

    public function uploadFile($name, $upload_path, $filename = false, $config = array() ){
        $valid = true;
        $msg   = 'success';
        $file  = Request::file($name);
        
        if(!array_key_exists('allowed_type',$config))
            $config['allowed_type'] = 'jpg';
        if(!array_key_exists('max_size',$config))
            $config['max_size'] = '1024';
        if(!array_key_exists('required',$config))
            $config['required'] = true;

        if($config['required'] && !$file){
            $valid = false;
            $msg   = $name . ' Wajib di isi.';
            $response['is_uploaded'] = $valid;
            $response['filename']    = null;
            $response['msg']         = array(
                                              'api_status' => 0,
                                              'api_code'   => 401,
                                              'api_message'=> $msg,
                                              'errors'     => null
                                            );
            return $response;
        }
        if($file){
            if(!in_array(strtolower($file->extension()),explode('|', $config['allowed_type']))){
                $valid = false;
                $msg   = 'Upload Gagal, Extension yang di ijinkan hanya '.  $config['allowed_type'];
            }

            if($file->getSize()> ($config['max_size'] * 1000)){
                $valid = false;
                $msg   = 'Upload Gagal, Maksimal size '. $config['max_size'] .' KB';
            }

            if($valid){
                if($filename){
                    $result = $file->storeAs(
                        $upload_path, $filename . '.' .$file->extension()
                    );
                }else{
                    $result = $file->store($upload_path);
                }
                $response['is_uploaded'] = $valid;
                $response['filename']    = $result;
                $response['msg']         = $msg;
            }else{
                $response['is_uploaded'] = $valid;
                $response['filename']    = null;
                $response['msg']         = array(
                                                'api_status' => 0,
                                                'api_code'   => 401,
                                                'api_message'=> $msg,
                                                'errors'     => null
                                                );
            }
        }else{
            $response['is_uploaded'] = $valid;
            $response['filename']    = null;
            $response['msg']         = $msg;
        }
        return $response;
    }

    public function validator($callback = false){
        $validator = Validator::make(Request::all(), $this->validator);
        if ($validator->fails()) {
            $result = array();
            $message = $validator->errors();
            
            if(!$callback)
            Sideveloper::createLog($message, 'VALIDATOR', 'warning');

            $result['api_status']  = 0;
            $result['api_code']    = 401;
            $result['api_message'] = 'Mengalami Masalah data yang di Input';
            $result['errors']      = $message;
            return response()->json($result);
        }
    }

    public function api_output($respone)
    {
        return response()->json($respone);
    }
}