import React, {Component} from 'react';
import { Tree } from 'antd';
import PropTypes from "prop-types";

const TreeNode = Tree.TreeNode;

class TreeComponent extends Component {

    static propTypes = {
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
    changeSelected: PropTypes.func
  };

  state = {
    expandedKeys: ['0-0-0'],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    children: []
  }

  componentDidMount() {
    const {data, selected} = this.props;
    const children = data.map(item => {return {title: item.name,
                                               key: item.id}});
    this.setState({children: children,
                   checkedKeys: selected.map(id => id.toString())})
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    const {changeSelected} = this.props
    console.log('onCheck', checkedKeys);
    changeSelected(checkedKeys.map(key => +key));
    this.setState({checkedKeys});
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  render() {
    const {children} = this.state    
    const treeData = [{
      title: 'Random System LTD',
      key: '0-0',
      children: [{
        title: 'Workers',
        key: '0-0-0',
        children: children,
      }],
    }];
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

export default TreeComponent;