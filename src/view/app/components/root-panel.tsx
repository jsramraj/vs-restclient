import * as React from "react";
import { HttpCollection, HttpContent } from "../../models/model";
import StyledWrapper from "./styled-wrapper";
import Sidebar from "./Sidebar";

class RootPanel extends React.Component {
  private data: HttpContent;
  constructor(props: any) {
    super(props);

    var initialData = JSON.parse(JSON.stringify(this.props))
      .initialData as HttpCollection[];
    console.log("RootPanel constructor Initial Data", initialData);

    let httpContent: HttpContent = {
      collections: initialData,
    };
    this.data = httpContent;
  }

  render() {
    this.data.collections[0].requests.map((request) => {
      console.log(request);
    });
    const constants = this.data.collections[0].constants.map((constant) => (
      <li key={constant.name}>
        {constant.name} : {constant.value}
      </li>
    ));

    return (
      <div>
        <h1>Root Panel</h1>
        <StyledWrapper className="flex flex-col h-full relative">
          <Sidebar collections={this.data.collections} />
          <section className="flex flex-grow flex-col overflow-auto">
            <h2>Constants</h2>
            <ul>{constants}</ul>
          </section>
        </StyledWrapper>
      </div>
    );
  }
}

export default RootPanel;
