import React, { Component } from 'react';
import { Table, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import EditCell, { EditableFormRow } from './EditCell';


const Controls = styled.div`  
  padding: 1rem;
  display: flex;
  width: 33%;
`;

class TableTemplate extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        сondition: PropTypes.bool.isRequired,
        email: PropTypes.string.isRequired,
        addresses: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
    history: PropTypes.object.isRequired,
    selected: PropTypes.arrayOf(PropTypes.number),
    updSelected: PropTypes.func.isRequired,
    updData: PropTypes.func,
    columns: PropTypes.array.isRequired,
  };

  static defaultProps = {
    updData: null,
    selected: [],
  }

  state = {
    dataCache: [],
  };

  componentWillMount() {
    const { data } = this.props;
    this.setState({ dataCache: data });
  }

  componentWillReceiveProps(nextProps) {
    const { dataCache } = this.state;
    const dataToTable = nextProps.data.map((itemProps) => {
      const findInDataChache = dataCache.find(itemCache => itemCache.id === itemProps.id);
      return findInDataChache || itemProps;
    });
    this.setState({ dataCache: dataToTable });
  }

  handleSave = (row) => {
    const {dataCache} = this.state
    const newData = [...dataCache];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataCache: newData });
  };

  handleSaveToStore = () => {
    const {updSelected, updData, history} = this.props
    const {dataCache} = this.state
    updSelected([]);
    updData(dataCache);
    history.push('/');
  };

  handleCancel = () => {
    const {updSelected, history} = this.props
    updSelected([]);
    history.push('/');
  };

  render() {
    const { dataCache } = this.state;
    const { columns, selected } = this.props;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditCell,
      },
    };

    const columnsEdit = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          inputType: col.dataIndex === 'сondition' ? 'checkbox' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          dataSource={dataCache}
          components={components}
          columns={columnsEdit}
          pagination={false}
          rowKey="id"
        />
        {!selected.length ? ''
          : <Controls>
            <Button style={{ margin: '0 auto' }} onClick={this.handleCancel}>Отмена</Button>
            <Button style={{ margin: '0 auto' }} onClick={this.handleSaveToStore}>Сохранить</Button>
          </Controls>
        }
      </div>
    );
  }
}

export default TableTemplate;
