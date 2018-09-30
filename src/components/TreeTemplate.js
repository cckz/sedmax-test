import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';

const {TreeNode: TreeNodeComp} = Tree;

class TreeComponent extends Component {
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
    selected: PropTypes.arrayOf(PropTypes.number),
    changeSelected: PropTypes.func,
  };

  static defaultProps = {
    selected: [],
    changeSelected: null,
  }

  state = {
    expandedKeys: ['0-0-0'],
    autoExpandParent: true,
    checkedKeys: [],
    children: [],
  }

  componentDidMount() {
    const { data, selected } = this.props;
    const children = data.map(item => ({
      title: item.name,
      key: item.id,
    }));
    this.setState({
      children,
      checkedKeys: selected.map(id => id.toString()),
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    const { changeSelected } = this.props;
    changeSelected(checkedKeys.map(key => +key));
    this.setState({ checkedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
          <TreeNodeComp title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNodeComp>
      );
    }
    return <TreeNodeComp {...item} />;
  })

  render() {
    const { children,
        expandedKeys,
        autoExpandParent,
        checkedKeys} = this.state;
    const treeData = [{
      title: 'Random System LTD',
      key: '0-0',
      children: [{
        title: 'Workers',
        key: '0-0-0',
        children,
      }],
    }];
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        onSelect={this.onSelect}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

export default TreeComponent;
