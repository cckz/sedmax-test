import React, { Component, createContext } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import styled from "styled-components";


const FormItem = Form.Item;
const EditableContext = createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditLayout = styled.div`  
  width: 100%;
`;

export const EditableFormRow = Form.create()(EditableRow);

class EditCell extends Component {
  static propTypes = {
    record: PropTypes.object,
    editable: PropTypes.bool,
    inputType: PropTypes.string,
    dataIndex: PropTypes.string,
    title: PropTypes.string,
    handleSave: PropTypes.func,
  };

  static defaultProps = {
    record: null,
    editable: false,
    inputType: '',
    dataIndex: '',
    title: '',
    handleSave: null,
  }

  state = {
    editing: false,
    checked: null,
  };

  componentWillMount() {
    const { record } = this.props;
    if (record) {
      this.setState({ checked: !record.сondition });
    }
  }

  componentDidMount() {
    const { editable, inputType} = this.props
    if (editable && inputType === 'text') {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    const { editable, inputType} = this.props
    if (editable && inputType === 'text') {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const {state} = this
    const editing = !state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;

    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      const chechedValues = this.chechedValuesInputs(values)
      handleSave({ ...record, ...chechedValues });
    });
  }

  chechedValuesInputs = (values) => {
    if (values.addresses && typeof (values.addresses) === 'string') {
      return values.addresses.split(',');
    }
    return values
  }

  toggleChecked = () => {
    const {checked} = this.state
    this.setState({ checked: !checked });
    const { record, handleSave } = this.props;
    handleSave({ ...record, ...{ сondition: checked } });
  };

  getRules = (nameField) => {
    const initRules = [{
      required: true,
      message: 'Email is required',
    }];

    if (nameField === 'email') {
      initRules.push({
        type: 'email',
        message: 'The input is not valid E-mail!',
      });
    }
    if (nameField === 'name') {
      initRules.push({
        pattern: '^[a-zA-Z ]*$',
        message: 'not valid name!',
      });
    }
    if (nameField === 'addresses') {
      initRules.push({
        validator: this.addressesValidator,
      });
    }
    return initRules;
  }

  addressesValidator = (rule, emails, callback) => {
    const errors = [];
    if (typeof (emails) === 'string') {
      emails.split(',').forEach((email) => {
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
          errors.push(
            new Error('is not valid E-mail'),
          );
        }
      });
    }
    callback(errors);
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      inputType,
      handleSave,
      ...restProps
    } = this.props;

    return (
      <td ref={(node) => {(this.cell = node)}} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing && inputType === 'text' ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: this.getRules(dataIndex),
                      initialValue: record[dataIndex],
                    })(
                        <Input
                         ref={(node) => {(this.input = node)}}
                         onPressEnter = {this.save}
                       />,
                    )}
                  </FormItem>
                ) : (
                  <EditLayout
                    onClick={inputType === 'text' ? this.toggleEdit : this.toggleChecked}
                  >
                    {restProps.children}
                  </EditLayout>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

export default EditCell;
