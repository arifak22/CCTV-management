import React, { Component, useState, useEffect  } from 'react';
import { Table} from 'reactstrap';

export default class DailyTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    

    render(){
        let item    = this.props.data;
        let lastday = this.props.lastday;

        let fieldTgl = [];
        for (let index = 1; index <= lastday; index++) {
            fieldTgl.push(<td key={index}>{index}</td>)
        }

        let simbol = [<i className="nav-icon fa fa-circle text-success"></i>, <i className="nav-icon fa fa-circle text-danger"></i>];
        let value    = [];
        let subvalue = [];
        let hasil    = [];
        if(item){
            for (let index = 0; index < item.length; index++) {
                value.push(<td><b>{item[index].abjad}</b></td>);
                value.push(<td colSpan={1 + lastday}><b>{item[index].kode_lokasi}</b></td>);
                hasil.push(<tr>{value}</tr>);
                if(item[index].data){
                    for (let j = 0; j < item[index].data.length; j++) {
                        subvalue.push(<td>{item[index].data[j].no}</td>);
                        subvalue.push(<td className="fix">{item[index].data[j].nama_cctv}</td>);
                        for (let k = 1; k <= lastday; k++) {
                            var tgl = 'tgl_'+k;
                            subvalue.push(<td>{simbol[item[index].data[j][tgl]]}</td>);
                        }
                        hasil.push(<tr>{subvalue}</tr>);
                        subvalue = [];
                    }
                }
                value = [];
            }
        }

        return(
            <Table hover bordered responsive>
                <thead>
                    <tr>
                        <td>No</td>
                        <td>CCTV</td>
                        {fieldTgl}
                    </tr>
                </thead>
                <tbody>
                    {
                        item.length > 0 ? 
                        hasil
                        :
                        <tr>
                            <td colSpan={lastday + 2}> Belum Ada Data</td>
                        </tr>
                    }
                </tbody>
            </Table>
        )
    }
}