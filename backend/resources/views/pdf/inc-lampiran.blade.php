<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <title>Report Lampiran</title>
    <link rel="stylesheet" href="{{Sideveloper::baseUrl()}}public/assets/style-report-pdf.css">
</head>
<body>
    <div id="content">
        {{-- @for ($i = 0; $i < 10; $i++) --}}
        @foreach($data as $key => $d)
            @if($key == 0)
            <p align="center"><b>ACTIVITY REPORT <br/> D. DOCUMENTATION OF INCIDENT REPORT {{$date}}</b></p>
            @endif
        <table style="width: 100%;" class="table1">
            <tr>
                <th align="left" style = "width: 100%;" colspan="2"><b>Lampiran : Incident Report</b></th>
            </tr>
            <tr>
                <th align="left" style = "width: 50%;">Nama: {{$d->nama_cctv}}</th>
                <th align="left" style = "width: 50%;">Tanggal: {{Sideveloper::getFullDate($d->waktu_finish)}}</th>
            </tr>
            <tr>
                <th>Sebelum</th>
                <th>Sesudah</th>
            </tr>
            <tr>
                <th style="height:350px;vertical-align:top;"><img style="max-width:300px;max-height:320px" src="{{storage_path(). '/app/'.$d->foto_before}}"/></th>
                <th style="height:350px;vertical-align:top;"><img style="max-width:300px;max-height:320px" src="{{storage_path(). '/app/'.$d->foto_after}}"/></th>
            </tr>
            <?php
                $foto = DB::table('incident_fotos')->select('file')->where('id_inc','=',$d->id_inc)->where('is_use','=','1')->get();
            ?>
            <tr>
                <th>Kegiatan I</th>
                <th>Kegiatan II</th>
            </tr>
            <tr>
                @foreach($foto as $f)
                <th style="height:350px;vertical-align:top;"><img style="max-width:300px;max-height:320px" src="{{storage_path(). '/app/'.$f->file}}"/></th>
                @endforeach
            </tr>
        </table>
        @if($key+1 != $count)
        <pagebreak/>
        @endif
        @endforeach
        {{-- @endfor --}}
</div>
</body>
</html>