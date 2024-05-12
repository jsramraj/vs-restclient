import * as React from "react";
import { HttpContent } from "../../models/model";

class RootPanel extends React.Component {
  private data: HttpContent;
  constructor(props: HttpContent) {
    super(props);

    this.data = (this.props as { initialData: HttpContent }).initialData;
    console.log("RootPanel constructor Initial Data", this.data);
  }

  render() {
    console.log(this.props);
    const constants = this.data.constants.map((constant) => (
      <li>
        {constant.name} : {constant.value}
      </li>
    ));

    const requests = this.data.requests.map((request) => (
      <li>
        {request.name} : {request.method} {request.url}
      </li>
    ));

    return (
      <div>
        <h1>Root Panel</h1>
        <h2>Constants</h2>
        <ul>{constants}</ul>
        <h2>Requests</h2>
        <ul>{requests}</ul>
      </div>
    );
  }
}

export default RootPanel;
