import React from "react";
import { RouteComponentProps } from 'react-router-dom';

interface AddProps extends RouteComponentProps<any> {
}

export default class AddScreen extends React.Component<AddProps> {
  render() {
    return (<div>{this.props.match.params.url}</div>)
  }
}
