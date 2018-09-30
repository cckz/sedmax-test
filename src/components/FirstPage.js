import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {Checkbox} from 'antd';
import PropTypes from 'prop-types'
import TableTemplate from './TableTemplate';
import {updateSelected} from '../actions';


class FirstPage extends Component {
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
  };

  render() {
    const {updateSelected} = this.props;
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) =>
        <Link
          to="/edit"
          onClick={() => updateSelected([record.id])}
        >
          {name}
      </Link>
    }, {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (text, record) => <Checkbox
          defaultChecked={record.сondition}
          disabled
      />
    }, {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    }, {
      title: 'Addresses',
      key: 'addresses',
      dataIndex: 'addresses',
      render: addresses => (
        <span>
          {addresses.map(address => <div key={address}>{address}</div>)}
        </span>
      ),
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Link
          to="/edit"
          onClick={() => {updateSelected([record.id])}}
        >
          Edit
        </Link>
      )}
    ];
    return (
      <TableTemplate
          {...this.props}
          columns = {columns}
      />
    )
  }
}

export default connect(state => {
    return {
         data: state.data,
         selected: state.selected
     }
}, {updateSelected})(FirstPage)