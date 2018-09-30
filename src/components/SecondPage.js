import React, {Component} from 'react';
import {connect}  from 'react-redux';
import {Checkbox} from 'antd';
import {updateSelected, updateData} from '../actions';
import TreeTemplate from './TreeTemplate'
import TableTemplate from './TableTemplate'
import PropTypes from "prop-types";


class SecondPage extends Component {

  static propTypes = {
    //from connect
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        сondition: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
        addresses: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired,
    selected: PropTypes.arrayOf(PropTypes.number),
    updateSelected: PropTypes.func.isRequired,
    updateData: PropTypes.func
  };

  handleTreeChangeSeclected = (ids) => {
    this.props.updateSelected(ids);
  };

  render() {
    const {data, selected} = this.props;
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true
    }, {
      title: 'Condition',
      dataIndex: 'сondition',
      key: 'сondition',
      editable: true,
      render: (text, record) => <Checkbox
          defaultChecked = {record.сondition}
          />
    }, {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      editable: true
    }, {
      title: 'Addresses',
      key: 'addresses',
      dataIndex: 'addresses',
      editable: true,
      render: addresses => (
        <span>
          {addresses.map(address => <div key={address}>{address}</div>)}
        </span>
      ),
    }];

    const dataToTable = data.filter(dataItem => {return (selected.includes(dataItem.id))});

    return (
      <div>
        <TreeTemplate
            {...this.props}
            changeSelected = {this.handleTreeChangeSeclected}
        />
        <TableTemplate
            {...this.props}
            data = {dataToTable}
            columns = {columns}
        />
      </div>
    )
  }
}

export default connect(state => ({
    data: state.data,
    selected: state.selected
}), {updateData, updateSelected})(SecondPage);