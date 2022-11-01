<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <title>Report Incident</title>
    <link rel="stylesheet" href="{{Sideveloper::baseUrl()}}public/assets/style-report-pdf.css">
</head>
<body>
    <p align="center"><b>ACTIVITY REPORT <br/> C. INCIDENT REPORT {{$date}}</b></p>

    <table style="width: 100%;" class="table1">
        <thead>
            <tr>
                <th style = "width: 5%;"><b>No</b></th>
                <th style = "width: 25%;">Hari & Tanggal</th>
                <th style = "width: 6%;">Jam</th>
                <th style = "width: 17%;">Kode</th>
                <th style = "width: 17%;">Kamera</th>
                <th style = "width: 30%;">Perbaikan</th>
            </tr>
        </thead>
        <tbody>
        <?php 
        $idx = 0; $idx2 = 0;
        $no = 1;
        $last_key = null;
        $dum_arr = array();
        ?>
        @foreach($data as $key => $d)
            @foreach ($d['data'] as $k => $item)
                <tr>
                    <td align = "center">{{$no++}}</td>
                    @if($k === 0)
                        @if($d['rows'] > 1)
                        <td rowspan="{{$d['rows']}}" align = "center">{{Sideveloper::getFullDate($item->waktu_finish)}}</td>
                        @else
                        <td align = "center">{{Sideveloper::getFullDate($item->waktu_finish)}}</td>
                        @endif
                    @endif
                    <td align = "center">{{Sideveloper::getHour($item->waktu_finish)}}</td>
                    <td align = "center">{{$item->kode_cctv}}</td>
                    <td align = "center">{{$item->nama_cctv}}</td>
                    <td align = "center">{{$item->perbaikan}}</td>
                </tr>
            @endforeach
        @endforeach
        </tbody>
    </table>
    <br>
    <br>
    <table style="width: 100%;" class="table2">
        <thead>
            <tr>
                <th style = "width: 30%;">MJC</th>
                <th colspan="2" style = "width: 70%;">PT PELABUHAN INDONESIA III</th>
            </tr>
            
        </thead>
        <tbody>
            <tr>
                <td align="center" style = "width: 30%;"><?=$ttd_1->jabatan?></td>
                <td align="center" style = "width: 35%;"><?=$ttd_2[0]->jabatan?></td>
                <td align="center" style = "width: 35%;"><?=$ttd_2[1]->jabatan?></td>
            </tr>
            <tr>
                <td style="height: 100px; text-align:center; vertical-align:bottom"><?=$ttd_1->nama?></td>
                <td style="height: 100px; text-align:center; vertical-align:bottom"><?=$ttd_2[0]->nama?></td>
                <td style="height: 100px; text-align:center; vertical-align:bottom"><?=$ttd_2[1]->nama?></td>
            </tr>
        </tbody>
    </table>
</body>
</html>