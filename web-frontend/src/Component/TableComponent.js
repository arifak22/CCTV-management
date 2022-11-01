import React, { Component } from 'react';
import { Col, Row, Table, FormGroup, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';
import Pagination from './PaginationComponent';

export default class TableList extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        sort      : null,
        sortStatus: 0,
        page      : 1,
        search    : '',
        row       : 5,
  
      }; // initialise state /
    }
    Sorting(val){
      // if(is_sorting){
        if(val === this.state.sort){
          var status;
          if(this.state.sortStatus === 0){
            status = 1
          } else if(this.state.sortStatus === 1) {
            status = 2
          } else {
            status = 0
            val = null
          }
          this.setState({sort: val, sortStatus: status}, () =>{
            this.FilterResult();
          })
          // this.props.handleSorting({sort: val, sortStatus: status});
        }else{
          this.setState({sort: val, sortStatus: 1}, () =>{
            this.FilterResult();
          })
          // this.props.handleSorting({sort: val, sortStatus: 1});
        }
      // }
    }
    onPageChanged = data => {
      const { currentPage } = data;
      this.setState({page: currentPage}, () => {
        this.FilterResult();
      });
    };
    handleSearch = event => {
      this.setState({search: event.target.value, page: 1}, () => {
        this.FilterResult();
      });
    };
    handleRow = event => {
      this.setState({row: event.target.value, page: 1}, () => {
        this.FilterResult();
      });
    };
    encodeQueryData(data) {
      const ret = [];
      for (let d in data){
        if(data[d])
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }
      return ret.join('&');
    }
    FilterResult(){
      var value = {
          page  : this.state.page,
          row   : this.state.row,
          search: this.state.search,
          by    : this.state.sort,
          sort  : this.state.sortStatus,
      }
      this.props.handleRespone(
        {
          query     : this.encodeQueryData(value)
        }
      );
    }
    HeaderField(columns){
      var icon  = ['fa fa-sort fa-sm mt-2', 'fa fa-sort-asc fa-sm mt-2', 'fa fa-sort-desc fa-sm mt-2'];
      var color = ['#bfbfbf', 'black', 'black' ];
      var value = [];
      for (let i = 0; i < columns.length; i++) {
        var width = columns[i].width ? columns[i].width : null;

        if(columns[i].field !== null && columns[i].sort !== false){
          value.push(<th width={width} style={{cursor: 'pointer'}} onClick={() => this.Sorting(columns[i].field)} key={i}>{columns[i].title}  <i style={{color: this.state.sort === columns[i].field ? color[this.state.sortStatus] : color[0]}} className={this.state.sort === columns[i].field ? icon[this.state.sortStatus] : icon[0]}></i></th>)
        }else{
          value.push(<th width={width} key={i}>{columns[i].title}</th>)
        }
      }
      return( 
        <thead>
          <tr>
            {value}
          </tr>
        </thead>
      )
    }
  
    ListValue(data, columns){
      var list;
      if(data != null){
        var no = data.from;
  
       
        list = data.data.map(function(item, i){
          var items = [];
  
          for (let index = 0; index < columns.length; index++) {
            if(columns[index].template){
              items.push(<td key={index}>{columns[index].template(item, i, no++ )}</td>)
            }else{
              items.push(<td key={index}>{item[columns[index].field]}</td>)
            }
          }
  
          return (
            <tr key={i}>
              {items}
            </tr>
          )
        })
      }
      return list;
    }
    render(){
      return(
        <React.Fragment>
          <Row>
            <Col xs="12" sm="6" md="6">
              <FormGroup row>
                  <Col xs="12" sm="6" md="4">
                    <Input onChange={this.handleRow} type="select" name="rows" id="rows">
                      <option value="5">5 Rows</option>
                      <option value="10">10 Rows</option>
                      <option value="15">15 Rows</option>
                      <option value="20">20 Rows</option>
                      <option value="25">25 Rows</option>
                      <option value="30">30 Rows</option>
                    </Input>
                </Col>
              </FormGroup>
            </Col>
  
            <Col xs="12" sm="6" md="6">
              <FormGroup row>
                <Col md="12">
                  <InputGroup className="pull-bottom">
                    <InputGroupAddon addonType="prepend">
                      <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                    </InputGroupAddon>
                    <Input onChange={this.handleSearch} type="text" id="input1-group2" name="input1-group2" placeholder="Type Here....." />
                  </InputGroup>
                </Col>
              </FormGroup>
            </Col>
  
          </Row>
          <Table hover bordered striped responsive>
              {this.HeaderField(this.props.columns)}
            <tbody>
              {
                this.props.loading ?
                <tr>
                  <td colSpan={this.props.columns.length} align="center">
                    Loading...
                  </td>
                </tr>
                :
                this.ListValue(this.props.data, this.props.columns)
              }
            </tbody>
          </Table>
         
          {
          this.props.data != null ?
            <Row>
              <Col xs="12" sm="6" md="6">
                <dt>Showing {this.props.data.from} to {this.props.data.to} of {this.props.data.total} entries</dt>
              </Col>
              <Col xs="12" sm="6" md="6">
                <Pagination totalRecords={this.props.data.total} pageLimit={parseInt(this.props.data.per_page)} pageNeighbours={1} onPageChanged={this.onPageChanged} />
              </Col>
            </Row>
            :
            null
          }
        </React.Fragment>
      )
    }
  }