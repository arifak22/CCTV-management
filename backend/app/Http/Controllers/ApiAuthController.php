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
use Tymon\JWTAuth\Exceptions\JWTException;
class ApiAuthController extends MiddleController
{
    public function postLogin(){
        $username = $this->input('username', 'required');
        $password = $this->input('password', 'required');

        if($this->validator()){
            return  $this->validator(true);
        }

        try {
            $respone['api_status']  = 0;
            $credentials = request(['username', 'password']);
            if (! $token = JWTAuth::attempt($credentials)) {
                $respone['api_message'] = 'Password dan Username tidak valid!';
                return $this->api_output($respone);
            }
        } catch (JWTException $e) {
            $respone['api_message'] = 'Terjadi Masalah';
            return $this->api_output($respone);
        }

        if(JWTAuth::user()->status == 0 ){
            $respone['api_status']  = 0;
            $respone['api_message'] = 'User sudah di banned';
            return $this->api_output($respone);
        }
        $user = DB::table('users')->select('id_privilege')->where('username',$username)->first();
        $foto = Sideveloper::baseUrl('storage/app/'.JWTAuth::user()->foto);
        $menu = DB::table('permissions')
                    ->select('menus.id_menu', 'sub_menus.id_sub_menu', 'nama_menu', 'ikon', 'menus.link as link_menu',
                     'nama_sub_menu', 'sub_menus.link as link_sub_menu')
                    ->join('sub_menus', 'sub_menus.id_sub_menu', '=', 'permissions.id_sub_menu')
                    ->join('menus', 'menus.id_menu', '=', 'sub_menus.id_menu')
                    ->orderBy('id_menu','asc')
                    ->where('id_privilege', $user->id_privilege)->get();
        $items = [];
        $i = 0;
        $k = -1;
        $is_first = true;
        $items[0]['name'] = 'Dashboard';
        $items[0]['url']  = '/dashboard';
        $items[0]['icon'] = 'icon-speedometer';
        foreach($menu as $key => $m){
            if($m->id_sub_menu === null){
                ++$i;
                $k=-1;
                $items[$i]['name'] = $m->nama_menu;
                $items[$i]['url']  = $m->link_menu;
                $items[$i]['icon'] = $m->ikon;
            }else{
                if(!$is_first){
                    if($menu[$key-1]->id_menu === $m->id_menu){
                        ++$k;
                        $items[$i]['name']                 = $m->nama_menu;
                        $items[$i]['url']                  = $m->link_menu;
                        $items[$i]['icon']                 = $m->ikon;
                        $items[$i]['children'][$k]['name'] = $m->nama_sub_menu;
                        $items[$i]['children'][$k]['url']  = $m->link_sub_menu;
                        $items[$i]['children'][$k]['icon'] = 'fa fa-circle-o';
                    }else{
                        $k = $k > 0 ? -1 : $k;
                        ++$k;
                        ++$i;
                        $items[$i]['name']                 = $m->nama_menu;
                        $items[$i]['url']                  = $m->link_menu;
                        $items[$i]['icon']                 = $m->ikon;
                        $items[$i]['children'][$k]['name'] = $m->nama_sub_menu;
                        $items[$i]['children'][$k]['url']  = $m->link_sub_menu;
                        $items[$i]['children'][$k]['icon'] = 'fa fa-circle-o';
                    }
                }else{
                    ++$k;
                    ++$i;
                    $items[$i]['name']                 = $m->nama_menu;
                    $items[$i]['url']                  = $m->link_menu;
                    $items[$i]['icon']                 = $m->ikon;
                    $items[$i]['children'][$k]['name'] = $m->nama_sub_menu;
                    $items[$i]['children'][$k]['url']  = $m->link_sub_menu;
                    $items[$i]['children'][$k]['icon'] = 'fa fa-circle-o';
                    $k = $k > 0 ? -1 : $k;
                }
            }
            $is_first = false;
        }
        $access_menu     = array_filter(array_column($menu->toArray(),'link_menu'));
        $access_sub_menu = array_filter(array_column($menu->toArray(),'link_sub_menu'));
        $sys = DB::table('syscodes')->where('code','SYS')->get();
        $sys_data = [];
        foreach($sys as $k => $s){
            $sys_data[$s->value] = $s->deskripsi;
        }
        $respone['api_status']   = 1;
        $respone['api_message']  = $foto;
        $respone['access_token'] = $token;
        $respone['sys']          = $sys_data;
        $respone['foto']         = $foto;
        $respone['access_menu']  = array('items'=>$items,'access'=>array_merge(array_merge($access_menu,$access_sub_menu),array('/dashboard','/')));

        return $this->api_output($respone);
    }

    /**
     * SYSTEM
     */

    #GET SYSTEM
    public function getSystem(){
        $value   = $this->input('value', 'required');
        if($this->validator()){
            return  $this->validator(true);
        }
        $data = DB::table('syscodes')->where('value', '=', $value)->where('code','SYS')->first();
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
}