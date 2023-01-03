import { mount } from "vue-app";
import React from 'react'

export default class Vue extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    mount();
  }

  render() {
    return <div id="vue-app" style={{ textAlign: "center"}}></div>;
  }
}
