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
use Carbon;
use Spreadsheet;
use Xlsx;
use Border;
use Color;

class ApiReportController extends MiddleController
{

    #PROSES DAILY REPORT
    public function postProsesDaily(){
        ini_set('max_execution_time', 0);
        #INPUT
        $periode   = $this->input('bulan', 'required|date_format:Y-m');
        $id_cabang = $this->input('cabang');

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }
        
        #FORMAT WAKTU JADI PERIODE
        $periode_start  = DB::raw("DATE_FORMAT(waktu_start,'%Y-%m')");
        $periode_finish = DB::raw("DATE_FORMAT(waktu_finish,'%Y-%m')");

        #AMBIL DATA INCIDENT DI PERIODE INPUT
        $q_incident = DB::table('incidents')
            ->select('id_cctv','waktu_start', 'waktu_finish', 'id_cabang')
            ->where(function($query) use ($periode_start, $periode_finish, $periode){
                $query->where(function($q) use ($periode_start, $periode_finish, $periode){
                    $q->where($periode_start, '>=', $periode)->where($periode_finish, '<=', $periode);
                })->orWhere(function($q) use ($periode_start, $periode_finish, $periode){
                    $q->where($periode_start, '<=', $periode)->whereNull('waktu_finish');
                });
            });
        if($id_cabang){
            $incident = $q_incident->where('id_cabang', $id_cabang)->get();
        }else{
            $incident = $q_incident->get();
        }

        #AMBIL SEMUA DATA CCTV
        $q_cctv = DB::table('cctvs')
            ->select('id_cctv','id_cabang')
            ->join('lokasis','lokasis.id_lokasi','=','cctvs.id_lokasi');
        if($id_cabang){
            $cctv = $q_cctv->where('id_cabang', $id_cabang)->get();
        }else{
            $cctv = $q_cctv->get();
        }

        #AMBIL JUMLAH TANGGAL PADA PERIODE
        if($periode == date('Y-m')){
            $lastday = intval(date('d'));
        }else{
            $lastday = Carbon::parse($periode.'-01')->daysInMonth;
        }

        #HAPUS PERIODE
        if($id_cabang){
            DB::table('dailys')->where('periode', $periode)->where('id_cabang', $id_cabang)->delete();
        }else{
            DB::table('dailys')->where('periode', $periode)->delete();
        }
        foreach($cctv as $key => $c){
            #MASUKAN DATA CCTV
            $save[$key]['id_cctv']        = $c->id_cctv;
            $save[$key]['id_cabang']      = $c->id_cabang;
            $save[$key]['periode']        = $periode;
            $save[$key]['last_refreshed'] = new \DateTime();
            $save[$key]['refresh_by']     = JWTAuth::user()->username;

            #ULANG SEMUA INCIDENT
            foreach($incident as $i){
                for ($j=1; $j <= $lastday; $j++) { 
                    $tgl = $j < 10 ? '0'.$j : $j; //MERUBAH FORMAT TANGGAL 1 JADI 01

                    if(Carbon::parse($periode.'-'.$tgl.' 23:59:59')->format('l') != 'Sunday'){
                        if($i->waktu_finish != ''){//JIKA ADA TANGGAL FINISH
                            #CEK APAKAH CCTV INCIDENT DAN CCTV TERPILIH ADA INCIDENT PADA TANGGAL DIULANG
                            if(($i->id_cctv == $c->id_cctv ) &&  Carbon::parse($periode.'-'.$tgl.' 23:59:59') >= $i->waktu_start && $i->waktu_finish >= Carbon::parse($periode.'-'.$tgl.' 23:59:59')){
                                $save[$key]['tgl_'.$j]   = 1;
                            }else{
                                if(!@$save[$key]['tgl_'.$j])
                                $save[$key]['tgl_'.$j]   =  0;
                            }
                        }else{
                            #CEK APAKAH CCTV INCIDENT DAN CCTV TERPILIH ADA INCIDENT PADA TANGGAL DIULANG
                            if(($i->id_cctv == $c->id_cctv ) &&  Carbon::parse($periode.'-'.$tgl.' 23:59:59') >= $i->waktu_start){
                                $save[$key]['tgl_'.$j]   = 1;
                            }else{
                                if(!@$save[$key]['tgl_'.$j])
                                $save[$key]['tgl_'.$j]   = 0 ;
                            }
                        }
                    }
                }
            }
        }
        #INSERT REPORT DAILY
        DB::table('dailys')->insert($save);

        $respone['api_status']  = 1;
        $respone['api_message'] = 'Dailys berhasil di refresh.';
        return $this->api_output($respone);
    }

    #AMBIL DAILY REPORT
    public function getDaily(){
        #INPUT
        $periode   = $this->input('bulan', 'date_format:Y-m');
        $id_cabang = $this->input('cabang');

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }
        $periode = $periode ? $periode : date('Y-m');
        $lastday = Carbon::parse($periode.'-01')->daysInMonth;

        if($id_cabang){
            $lokasi = DB::table('lokasis')
            ->orderBy('id_cabang')
            ->orderBy('kode_lokasi')
            ->where('id_cabang', $id_cabang)->get();
        }else{
            $lokasi = DB::table('lokasis')->get();
        }
        $data = [];
        $abjad = 'A';
        $no = 1;
        foreach($lokasi as $key => $l){
            $data[$key]['kode_lokasi'] = $l->kode_lokasi;
            $data[$key]['abjad'] = $abjad;
            $abjad++;
            $list = Sideveloper::getListDaily()
                ->where('periode',$periode)
                ->where('cctvs.id_lokasi', $l->id_lokasi)
                ->get();
            foreach($list as $key2 => $li){
                $data[$key]['data'][$key2]['no']        = $no++;
                $data[$key]['data'][$key2]['nama_cctv'] = $li->nama_cctv;
                for ($i=1; $i <= $lastday; $i++) { 
                    $tgl = 'tgl_'.$i;
                    $data[$key]['data'][$key2][$tgl] = $li->$tgl;
                }
            }
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success.';
        $respone['data']        = $data;
        $respone['lastday']     = $lastday;
        return $this->api_output($respone);
    }

    #PRINT EXCEL REPORT
    public function getExcelDailyOld(){
        #INPUT
        $periode     = $this->input('bulan', 'required|date_format:Y-m');
        $id_cabang   = $this->input('cabang');
        $nama_cabang = $id_cabang ? $id_cabang : 'ALL';
        $path        = storage_path(). '/app/public/excel/';
        $filename    = 'Daily-'.$nama_cabang.$periode .'.xlsx';

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }


        $lastday = Carbon::parse($periode.'-01')->daysInMonth;

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        /**
         * HEADER EXCEL
         */
        #TITLE
        $sheet->setCellValue('A1', 'CHECKLIST AVAILABILITY REPORT');
        $sheet->setCellValue('A2', 'PEKERJAAN MAINTENANCE CCTV PT PELABUHAN INDONESIA III (PERSERO) TPKS');
        $sheet->getStyle("A1:A2")->getFont()->setSize(16);
        $sheet->getStyle("A1:A2")->getFont()->setBold(true);


        #CCTV KOLOM KETERANGAN
        $sheet->setCellValue('A3', 'No');
        $sheet->setCellValue('B3', 'LOKASI / KODE');
        $sheet->setCellValue('C3', 'NAMA');
        $sheet->setCellValue('D3', 'IP');
        $sheet->setCellValue('E3', 'MERK');

        #CCTV BULAN KETERANGAN
        $sheet->setCellValue('F3', 'Bulan '. $periode);

        #LOOP TANGGAL PADA PERIODE
        $fieldTgl = 'E';
        for ($i=1; $i <= $lastday; $i++) { 
            $fieldTgl++;
            #SUB TANGGAL PADA BULAN
            $sheet->setCellValue($fieldTgl.'4', $i);
        }

        #MERGE TITLE SESUAI PANJANG TANGGAL
        $sheet->mergeCells("A1:".$fieldTgl."1");
        $sheet->mergeCells("A2:".$fieldTgl."2");

        #MERGE BULAN SESUAI PANJANG TANGGAL
        $sheet->mergeCells("F3:".$fieldTgl."3");

        #MERGE CCTV KETERANGAN
        $sheet->mergeCells("A3:A4");
        $sheet->mergeCells("B3:B4");
        $sheet->mergeCells("C3:C4");
        $sheet->mergeCells("D3:D4");
        $sheet->mergeCells("E3:E4");

        /**
         * INTI ISIAN
         */
        if($id_cabang){
            $lokasi = DB::table('lokasis')
            ->orderBy('id_cabang')
            ->orderBy('kode_lokasi')
            ->where('id_cabang', $id_cabang)->get();
        }else{
            $lokasi = DB::table('lokasis')->get();
        }

        $abjad = 'A';
        $no    = 1;
        $row   = 5;
        foreach($lokasi as $l){
            $sheet->setCellValue('A'.$row, $abjad);
            $sheet->setCellValue('B'.$row, $l->kode_lokasi);
            $row++;
            $abjad++;
            $data = Sideveloper::getListDaily()->where('periode',$periode)->where('cctvs.id_lokasi', $l->id_lokasi)->get();
            foreach($data as $d){
                $sheet->setCellValue('A'.$row, $no);
                $sheet->setCellValue('B'.$row, $d->kode_cctv);
                $sheet->setCellValue('C'.$row, $d->nama_cctv);
                $sheet->setCellValue('D'.$row, $d->ip);
                $sheet->setCellValue('E'.$row, $d->id_merk);
                $fieldTgl = 'E';
                for ($i=1; $i <= $lastday; $i++) { 
                    $fieldTgl++;
                    $tgl = 'tgl_'.$i;
                    #SUB TANGGAL PADA BULAN
                    $sheet->setCellValue($fieldTgl.$row, $d->$tgl);
                }
                $row++;
                $no++;
            }
        }
        $fieldTgl--;
        $row--;
        $sheet->getStyle('A3:'.$fieldTgl.$row)
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN)
            ->setColor(new Color('000000'));

        
        $sheet->getStyle('A:E')->getAlignment()->setHorizontal('left');
        $sheet->getStyle('F:'.$fieldTgl)->getAlignment()->setHorizontal('center');

        // $sheet->getStyle('A1:A2')->getAlignment()->setHorizontal('center');
        // $sheet->getStyle('A1:A2')->getAlignment()->setVertical('center');

        
        for ($i='A'; $i <= $fieldTgl; $i++) { 
            $sheet->getColumnDimension($i)->setAutoSize(true);
        }
        $writer = new Xlsx($spreadsheet);
        $writer->save($path.$filename);
        $path = Sideveloper::baseUrl('storage/app/public/excel/'.$filename);
        return $this->api_output(array('path'=>$path));
        // print_r($writer);
    }
    public function getExcelDaily(){
         #INPUT
         $periode     = $this->input('bulan', 'required|date_format:Y-m');
         $id_cabang   = $this->input('cabang');
         #AMBIL ALIAS CABANG
         if($id_cabang){
             $cabang      = DB::table('cabangs')->where('id_cabang',$id_cabang)->first();
             $nama_cabang = $cabang->alias_cabang;
         }else{
             $nama_cabang = 'ALL';
         }
         $path        = storage_path(). '/app/public/excel/';
         $filename    = 'Daily'.$nama_cabang.' '.$periode .'.xlsx';
 
         #VALIDASI
         if($this->validator()){
             return  $this->validator(true);
         }
 
 
         $lastday = Carbon::parse($periode.'-01')->daysInMonth;
 
         $spreadsheet = new Spreadsheet();
         $sheet = $spreadsheet->getActiveSheet();
 
         /**
          * HEADER EXCEL
          */
         #TITLE
         $sheet->setCellValue('A1', 'CHECKLIST AVAILABILITY REPORT');
         $sheet->setCellValue('A2', 'PEKERJAAN MAINTENANCE CCTV PT PELABUHAN INDONESIA III (PERSERO) '.$nama_cabang);
         $sheet->getStyle("A1:A2")->getFont()->setSize(16);
         $sheet->getStyle("A1:A2")->getFont()->setBold(true);
         $sheet->getStyle('A1:A2')->getAlignment()->setHorizontal('center');
 
 
         #CCTV KOLOM KETERANGAN
         $sheet->setCellValue('A3', 'No');
         $sheet->setCellValue('B3', 'LOKASI / KODE');
         $sheet->setCellValue('C3', 'NAMA');
         $sheet->setCellValue('D3', 'IP');
         $sheet->setCellValue('E3', 'MERK');
 
         #CCTV BULAN KETERANGAN
         $sheet->setCellValue('F3', 'Bulan '. Sideveloper::bulan(Sideveloper::getBulan($periode)).' '.Sideveloper::getTahun($periode));
 
         #LOOP TANGGAL PADA PERIODE
         $fieldTgl = 'E';
         for ($i=1; $i <= $lastday; $i++) { 
             $fieldTgl++;
             #SUB TANGGAL PADA BULAN
             $sheet->setCellValue($fieldTgl.'4', $i);
         }
 
         #MERGE TITLE SESUAI PANJANG TANGGAL
         $sheet->mergeCells("A1:".$fieldTgl."1");
         $sheet->mergeCells("A2:".$fieldTgl."2");
 
         #MERGE BULAN SESUAI PANJANG TANGGAL
         $sheet->mergeCells("F3:".$fieldTgl."3");
 
         #MERGE CCTV KETERANGAN
         $sheet->mergeCells("A3:A4");
         $sheet->mergeCells("B3:B4");
         $sheet->mergeCells("C3:C4");
         $sheet->mergeCells("D3:D4");
         $sheet->mergeCells("E3:E4");
 
         /**
          * INTI ISIAN
          */
         if($id_cabang){
             $lokasi = DB::table('lokasis')
             ->orderBy('id_cabang')
             ->orderBy('kode_lokasi')
             ->where('id_cabang', $id_cabang)->get();
         }else{
             $lokasi = DB::table('lokasis')->get();
         }
 
         $abjad = 'A';
         $no    = 1;
         $row   = 5;
         $lokasiBreak = null;
         foreach($lokasi as $l){
             $lokasiBreak[] = $row;
             $sheet->setCellValue('A'.$row, $abjad);
             $sheet->setCellValue('B'.$row, $l->kode_lokasi);
             $row++;
             $abjad++;
             $data = Sideveloper::getListDaily()->where('periode',$periode)->where('cctvs.id_lokasi', $l->id_lokasi)->get();
             foreach($data as $d){
                 $sheet->setCellValue('A'.$row, $no);
                 $sheet->setCellValue('B'.$row, $d->kode_cctv);
                 $sheet->setCellValue('C'.$row, $d->nama_cctv);
                 $sheet->setCellValue('D'.$row, $d->ip);
                 $sheet->setCellValue('E'.$row, $d->id_merk);
                 $fieldTgl = 'E';
                 for ($i=1; $i <= $lastday; $i++) { 
                     $fieldTgl++;
                     $tgl = 'tgl_'.$i;
                     #ISIAN TANGGAL
                     $color = 'f86c6b';
                     if($d->$tgl == 1){ //rusak => merah
                         $color = 'f86c6b';
                     }else{ //hidup => kuning
                         $color = '4dbd74';
                     }
                    if($d->$tgl === '0' || $d->$tgl === '1'){
                        $sheet->getStyle($fieldTgl.$row)->getFill()
                        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB($color);
                    }
                 }
                 $row++;
                 $no++;
             }
         }
         $fieldTgl--;
         $row--;
         $l = $row + 4; //garis sampai akhir ditambah keterangan
         #CRETATE BORDER GARIS
         $sheet->getStyle('A3:'.$fieldTgl.$l)
             ->getBorders()
             ->getAllBorders()
             ->setBorderStyle(Border::BORDER_THIN)
             ->setColor(new Color('000000'));
 
         #PADA SETIAP LOKASI MASTER BERI WARNA BIRU
         foreach($lokasiBreak as $lb){
             $sheet->getStyle('A'.$lb.':'.$fieldTgl.$lb)->getFill()
             ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('daeef3');
         }
         
         #SEMUA MERGE CENTER
         $alignment_center = \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER;
         foreach($sheet->getRowIterator() as $rowk) {
             foreach($rowk->getCellIterator() as $cell) {
                 $cellCoordinate = $cell->getCoordinate();
                 $sheet->getStyle($cellCoordinate)->getAlignment()->setHorizontal($alignment_center);
             }
         }
 
         #CRETE KETERANGAN
         $row = $row + 2;
         $sheet->setCellValue('AB'.$row, 'KETERANGAN');
         $sheet->getStyle('AB'.$row)->getAlignment()->setHorizontal('left');
         
         $sheet->getStyle('AB'.++$row)->getFill()
         ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('f86c6b');
         $sheet->setCellValue('AC'.$row, ':');
         $sheet->setCellValue('AD'.$row, 'CCTV Rusak');
         $sheet->mergeCells("AD".$row.":AG".$row);
         $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');
 
         $sheet->getStyle('AB'.++$row)->getFill()
         ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('4dbd74');
         $sheet->setCellValue('AC'.$row, ':');
         $sheet->setCellValue('AD'.$row, 'CCTV ON');
         $sheet->mergeCells("AD".$row.":AG".$row);
         $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');
 
         #BERI UKURAN WIDTH KOLOM
         $fieldTgl = 'E';
         for ($i=1; $i <= $lastday; $i++) { 
             $fieldTgl++;
             $sheet->getColumnDimension($fieldTgl)->setWidth(7);
         }
 
         $sheet->getColumnDimension('A')->setWidth(5);
         $sheet->getColumnDimension('B')->setWidth(25);
         $sheet->getColumnDimension('C')->setWidth(45);
         $sheet->getColumnDimension('D')->setWidth(15);
         $sheet->getColumnDimension('E')->setWidth(23);
 
         $writer = new Xlsx($spreadsheet);
         $writer->save($path.$filename);
         $path = Sideveloper::baseUrl('storage/app/public/excel/'.$filename);
         return $this->api_output(array('path'=>$path));
    }

    #PROSES REALISASI REPORT
    public function postProsesRealisasi(){
        ini_set('max_execution_time', 0);
        #INPUT
        $periode   = $this->input('bulan', 'required|date_format:Y-m');
        $id_cabang = $this->input('cabang');

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }
        
        #FORMAT WAKTU JADI PERIODE
        $periode_start  = DB::raw("DATE_FORMAT(waktu_start,'%Y-%m')");
        $periode_finish = DB::raw("DATE_FORMAT(waktu_finish,'%Y-%m')");

        #AMBIL DATA RUSAK DI PERIODE INPUT
        $q_rusak = DB::table('incidents')
            ->select('id_cctv','waktu_start', 'waktu_finish', 'id_cabang')
            ->where(function($query) use ($periode_start, $periode_finish, $periode){
                $query->where(function($q) use ($periode_start, $periode_finish, $periode){
                    $q->where($periode_start, '>=', $periode)->where($periode_finish, '<=', $periode);
                })->orWhere(function($q) use ($periode_start, $periode_finish, $periode){
                    $q->where($periode_start, '<=', $periode)->whereNull('waktu_finish');
                });
            })->where('id_status_inc', 3);
            
        if($id_cabang){
            $rusak = $q_rusak->where('id_cabang', $id_cabang)->get();
        }else{
            $rusak = $q_rusak->get();
        }

        #AMBIL DATA INCIDENT
        $q_incident = DB::table('incidents')
            ->select('id_cctv',  DB::raw("DATE_FORMAT(waktu_finish,'%Y-%m-%d') as waktu_finish"), 'id_cabang')
            ->where($periode_finish, $periode);
        if($id_cabang){
            $incident = $q_incident->where('id_cabang', $id_cabang)->get();
        }else{
            $incident = $q_incident->get();
        } 

        #AMBIL DATA MAINTENANCE
        $q_mt = DB::table('maintenances')
            ->select('id_cctv',  DB::raw("DATE_FORMAT(waktu,'%Y-%m-%d') as waktu"), 'id_cabang')
            ->where(DB::raw("DATE_FORMAT(waktu,'%Y-%m')"), $periode);
        if($id_cabang){
            $mt = $q_mt->where('id_cabang', $id_cabang)->get();
        }else{
            $mt = $q_mt->get();
        } 

        #AMBIL SEMUA DATA CCTV
        $q_cctv = DB::table('cctvs')
            ->select('id_cctv','id_cabang')
            ->join('lokasis','lokasis.id_lokasi','=','cctvs.id_lokasi');
        if($id_cabang){
            $cctv = $q_cctv->where('id_cabang', $id_cabang)->get();
        }else{
            $cctv = $q_cctv->get();
        }

        #AMBIL JUMLAH TANGGAL PADA PERIODE
        if($periode == date('Y-m')){
            $lastday = intval(date('d'));
        }else{
            $lastday = Carbon::parse($periode.'-01')->daysInMonth;
        }

        #HAPUS PERIODE
        if($id_cabang){
            DB::table('realisasis')->where('periode', $periode)->where('id_cabang', $id_cabang)->delete();
        }else{
            DB::table('realisasis')->where('periode', $periode)->delete();
        }
        foreach($cctv as $key => $c){
            #MASUKAN DATA CCTV
            $save[$key]['id_cctv']        = $c->id_cctv;
            $save[$key]['id_cabang']      = $c->id_cabang;
            $save[$key]['periode']        = $periode;
            $save[$key]['last_refreshed'] = new \DateTime();
            $save[$key]['refresh_by']     = JWTAuth::user()->username;

            #ULANG SEMUA INCIDENT
            foreach($rusak as $i){
                for ($j=1; $j <= $lastday; $j++) { 
                    $tgl = $j < 10 ? '0'.$j : $j; //MERUBAH FORMAT TANGGAL 1 JADI 01

                    if(Carbon::parse($periode.'-'.$tgl.' 23:59:59')->format('l') != 'Sunday'){
                        if($i->waktu_finish != ''){//JIKA ADA TANGGAL FINISH
                            #CEK APAKAH CCTV INCIDENT DAN CCTV TERPILIH ADA INCIDENT PADA TANGGAL DIULANG
                            if(($i->id_cctv == $c->id_cctv ) &&  Carbon::parse($periode.'-'.$tgl.' 23:59:59') >= $i->waktu_start && $i->waktu_finish >= Carbon::parse($periode.'-'.$tgl.' 23:59:59')){
                                $save[$key]['tgl_'.$j]   = 1;
                            }else{
                                if(!@$save[$key]['tgl_'.$j])
                                $save[$key]['tgl_'.$j]   =  null;
                            }
                        }else{
                            #CEK APAKAH CCTV INCIDENT DAN CCTV TERPILIH ADA INCIDENT PADA TANGGAL DIULANG
                            if(($i->id_cctv == $c->id_cctv ) &&  Carbon::parse($periode.'-'.$tgl.' 23:59:59') >= $i->waktu_start){
                                $save[$key]['tgl_'.$j]   = 1;
                            }else{
                                if(!@$save[$key]['tgl_'.$j])
                                $save[$key]['tgl_'.$j]   = null ;
                            }
                        }
                    }
                }
            }

            foreach($incident as $i){
                for ($j=1; $j <= $lastday; $j++) { 
                    $tgl = $j < 10 ? '0'.$j : $j; //MERUBAH FORMAT TANGGAL 1 JADI 01
                    if(($i->id_cctv == $c->id_cctv ) && $i->waktu_finish == $periode.'-'.$tgl){
                        $save[$key]['tgl_'.$j]  = 2;
                    }else{
                        if(!@$save[$key]['tgl_'.$j])
                        $save[$key]['tgl_'.$j]   = null ;
                    }
                }
            }

            foreach($mt as $i){
                for ($j=1; $j <= $lastday; $j++) { 
                    $tgl = $j < 10 ? '0'.$j : $j; //MERUBAH FORMAT TANGGAL 1 JADI 01
                    if(($i->id_cctv == $c->id_cctv ) && $i->waktu == $periode.'-'.$tgl){
                        if($save[$key]['tgl_'.$j] == 2){
                            $save[$key]['tgl_'.$j]  = 4;
                        }else{
                            $save[$key]['tgl_'.$j]  = 3;
                        }
                    }else{
                        if(!@$save[$key]['tgl_'.$j])
                        $save[$key]['tgl_'.$j]   = null ;
                    }
                }
            }
        }
        #INSERT REPORT REALISASI
        DB::table('realisasis')->insert($save);

        $respone['api_status']  = 1;
        $respone['api_message'] = 'Realisasi berhasil di refresh.';
        return $this->api_output($respone);
    }

    #AMBIL REALISASI REPORT
    public function getRealisasi(){
        #INPUT
        $periode   = $this->input('bulan', 'date_format:Y-m');
        $id_cabang = $this->input('cabang');

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }
        $periode = $periode ? $periode : date('Y-m');
        $lastday = Carbon::parse($periode.'-01')->daysInMonth;

        if($id_cabang){
            $lokasi = DB::table('lokasis')
            ->orderBy('id_cabang')
            ->orderBy('kode_lokasi')
            ->where('id_cabang', $id_cabang)->get();
        }else{
            $lokasi = DB::table('lokasis')->get();
        }
        $data = [];
        $abjad = 'A';
        $no = 1;
        foreach($lokasi as $key => $l){
            $data[$key]['kode_lokasi'] = $l->kode_lokasi;
            $data[$key]['abjad'] = $abjad;
            $abjad++;
            $list = Sideveloper::getListRealisasi()
                ->where('periode',$periode)
                ->where('cctvs.id_lokasi', $l->id_lokasi)
                ->get();
            foreach($list as $key2 => $li){
                $data[$key]['data'][$key2]['no']        = $no++;
                $data[$key]['data'][$key2]['nama_cctv'] = $li->nama_cctv;
                for ($i=1; $i <= $lastday; $i++) { 
                    $tgl = 'tgl_'.$i;
                    $data[$key]['data'][$key2][$tgl] = $li->$tgl;
                }
            }
        }
        $respone['api_status']  = 1;
        $respone['api_message'] = 'success.';
        $respone['data']        = $data;
        $respone['lastday']     = $lastday;
        return $this->api_output($respone);
    }

    #PRINT EXCEL REPORT
    public function getExcelRealisasi(){
        #INPUT
        $periode     = $this->input('bulan', 'required|date_format:Y-m');
        $id_cabang   = $this->input('cabang');
        #AMBIL ALIAS CABANG
        if($id_cabang){
            $cabang      = DB::table('cabangs')->where('id_cabang',$id_cabang)->first();
            $nama_cabang = $cabang->alias_cabang;
        }else{
            $nama_cabang = 'ALL';
        }
        $path        = storage_path(). '/app/public/excel/';
        $filename    = 'Realisasi'.$nama_cabang.' '.$periode .'.xlsx';

        #VALIDASI
        if($this->validator()){
            return  $this->validator(true);
        }


        $lastday = Carbon::parse($periode.'-01')->daysInMonth;

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        /**
         * HEADER EXCEL
         */
        #TITLE
        $sheet->setCellValue('A1', 'CHECKLIST REALISASI REPORT');
        $sheet->setCellValue('A2', 'PEKERJAAN MAINTENANCE CCTV PT PELABUHAN INDONESIA III (PERSERO) '.$nama_cabang);
        $sheet->getStyle("A1:A2")->getFont()->setSize(16);
        $sheet->getStyle("A1:A2")->getFont()->setBold(true);
        $sheet->getStyle('A1:A2')->getAlignment()->setHorizontal('center');


        #CCTV KOLOM KETERANGAN
        $sheet->setCellValue('A3', 'No');
        $sheet->setCellValue('B3', 'LOKASI / KODE');
        $sheet->setCellValue('C3', 'NAMA');
        $sheet->setCellValue('D3', 'IP');
        $sheet->setCellValue('E3', 'MERK');

        #CCTV BULAN KETERANGAN
        $sheet->setCellValue('F3', 'Bulan '. Sideveloper::bulan(Sideveloper::getBulan($periode)).' '.Sideveloper::getTahun($periode));

        #LOOP TANGGAL PADA PERIODE
        $fieldTgl = 'E';
        for ($i=1; $i <= $lastday; $i++) { 
            $fieldTgl++;
            #SUB TANGGAL PADA BULAN
            $sheet->setCellValue($fieldTgl.'4', $i);
        }

        #MERGE TITLE SESUAI PANJANG TANGGAL
        $sheet->mergeCells("A1:".$fieldTgl."1");
        $sheet->mergeCells("A2:".$fieldTgl."2");

        #MERGE BULAN SESUAI PANJANG TANGGAL
        $sheet->mergeCells("F3:".$fieldTgl."3");

        #MERGE CCTV KETERANGAN
        $sheet->mergeCells("A3:A4");
        $sheet->mergeCells("B3:B4");
        $sheet->mergeCells("C3:C4");
        $sheet->mergeCells("D3:D4");
        $sheet->mergeCells("E3:E4");

        /**
         * INTI ISIAN
         */
        if($id_cabang){
            $lokasi = DB::table('lokasis')
            ->orderBy('id_cabang')
            ->orderBy('kode_lokasi')
            ->where('id_cabang', $id_cabang)->get();
        }else{
            $lokasi = DB::table('lokasis')->get();
        }

        $abjad = 'A';
        $no    = 1;
        $row   = 5;
        $lokasiBreak = null;
        foreach($lokasi as $l){
            $lokasiBreak[] = $row;
            $sheet->setCellValue('A'.$row, $abjad);
            $sheet->setCellValue('B'.$row, $l->kode_lokasi);
            $row++;
            $abjad++;
            $data = Sideveloper::getListRealisasi()->where('periode',$periode)->where('cctvs.id_lokasi', $l->id_lokasi)->get();
            foreach($data as $d){
                $sheet->setCellValue('A'.$row, $no);
                $sheet->setCellValue('B'.$row, $d->kode_cctv);
                $sheet->setCellValue('C'.$row, $d->nama_cctv);
                $sheet->setCellValue('D'.$row, $d->ip);
                $sheet->setCellValue('E'.$row, $d->id_merk);
                $fieldTgl = 'E';
                for ($i=1; $i <= $lastday; $i++) { 
                    $fieldTgl++;
                    $tgl = 'tgl_'.$i;
                    #ISIAN TANGGAL
                    $color = 'f86c6b';
                    if($d->$tgl == 1){ //rusak => merah
                        $color = 'f86c6b';
                    }else if($d->$tgl == 2){ //incident => kuning
                        $color = 'ffc107';
                    }else if($d->$tgl == 3){ //maintenance => hijau
                        $color = '4dbd74';
                    }else{ //incident & maintenance => ungu
                        $color = '7030a0';
                    }
                    if($d->$tgl){ //jika ada rubah warna
                        $sheet->getStyle($fieldTgl.$row)->getFill()
                        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB($color);
                    }
                }
                $row++;
                $no++;
            }
        }
        $fieldTgl--;
        $row--;
        $l = $row + 6; //garis sampai akhir ditambah keterangan
        #CRETATE BORDER GARIS
        $sheet->getStyle('A3:'.$fieldTgl.$l)
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN)
            ->setColor(new Color('000000'));

        #PADA SETIAP LOKASI MASTER BERI WARNA BIRU
        foreach($lokasiBreak as $lb){
            $sheet->getStyle('A'.$lb.':'.$fieldTgl.$lb)->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('daeef3');
        }
        
        #SEMUA MERGE CENTER
        $alignment_center = \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER;
        foreach($sheet->getRowIterator() as $rowk) {
            foreach($rowk->getCellIterator() as $cell) {
                $cellCoordinate = $cell->getCoordinate();
                $sheet->getStyle($cellCoordinate)->getAlignment()->setHorizontal($alignment_center);
            }
        }

        #CRETE KETERANGAN
        $row = $row + 2;
        $sheet->setCellValue('AB'.$row, 'KETERANGAN');
        $sheet->getStyle('AB'.$row)->getAlignment()->setHorizontal('left');
        
        $sheet->getStyle('AB'.++$row)->getFill()
        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('f86c6b');
        $sheet->setCellValue('AC'.$row, ':');
        $sheet->setCellValue('AD'.$row, 'Rusak');
        $sheet->mergeCells("AD".$row.":AG".$row);
        $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');

        $sheet->getStyle('AB'.++$row)->getFill()
        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('ffc107');
        $sheet->setCellValue('AC'.$row, ':');
        $sheet->setCellValue('AD'.$row, 'Incident');
        $sheet->mergeCells("AD".$row.":AG".$row);
        $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');

        $sheet->getStyle('AB'.++$row)->getFill()
        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('4dbd74');
        $sheet->setCellValue('AC'.$row, ':');
        $sheet->setCellValue('AD'.$row, 'Maintenance');
        $sheet->mergeCells("AD".$row.":AG".$row);
        $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');

        $sheet->getStyle('AB'.++$row)->getFill()
        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('7030a0');
        $sheet->setCellValue('AC'.$row, ':');
        $sheet->setCellValue('AD'.$row, 'Incident & Maintenance');
        $sheet->mergeCells("AD".$row.":AG".$row);
        $sheet->getStyle('AD'.$row)->getAlignment()->setHorizontal('left');

        #BERI UKURAN WIDTH KOLOM
        $fieldTgl = 'E';
        for ($i=1; $i <= $lastday; $i++) { 
            $fieldTgl++;
            $sheet->getColumnDimension($fieldTgl)->setWidth(7);
        }

        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(45);
        $sheet->getColumnDimension('D')->setWidth(15);
        $sheet->getColumnDimension('E')->setWidth(23);

        $writer = new Xlsx($spreadsheet);
        $writer->save($path.$filename);
        $path = Sideveloper::baseUrl('storage/app/public/excel/'.$filename);
        return $this->api_output(array('path'=>$path));
    }

}