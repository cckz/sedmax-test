import React, {Component, createContext} from 'react';
import {Form, Input} from 'antd';
import PropTypes from "prop-types";


const FormItem = Form.Item;
const EditableContext = createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

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

  state = {
    editing: false,
    checked: null,
  };

  componentWillMount() {
    const {record} = this.props
    if (record) {
      this.setState({checked: !record.сondition})
    }
  }

  componentDidMount() {
    if (this.props.editable && this.props.inputType === 'text') {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable && this.props.inputType === 'text') {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = (e) => {
    const {editing} = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };
  
  save = () => {
    const {record, handleSave} = this.props;

    this.form.validateFields((error, values) => {
      if (error) {
        console.log(error)
        return;
      }
      this.toggleEdit()
      if (values.addresses && typeof(values.addresses) === 'string') {
        values.addresses = values.addresses.split(',')
      }
      handleSave({...record, ...values});
    });
  }

  toggleChecked = () => {
    this.setState({checked: !this.state.checked});
    const {record, handleSave} = this.props;
    handleSave({...record, ...{"сondition" : this.state.checked}});
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
        pattern: "^[a-zA-Z ]*$",
        message: 'not valid name!',
      });
    }
    if (nameField === 'addresses') {
      initRules.push({
          validator: this.addressesValidator,
      })
    }
    return initRules
  }

  addressesValidator = (rule, emails, callback) => {
    const errors = [];
    if (typeof(emails) === 'string') {
      emails.split(",").forEach(email => {
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
          errors.push(
            new Error("is not valid E-mail"))
          }
      })
    }
    callback(errors);
  };

  render() {
    const {editing} = this.state;
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
      <td ref={node => (this.cell = node)} {...restProps}>
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
                         ref={node => (this.input = node)}
                         onPressEnter = {this.save}
                       />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{paddingRight: 24}}
                    onClick={inputType === 'text' ? this.toggleEdit : this.toggleChecked}
                  >
                    {restProps.children}
                  </div>
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