import * as React from "react";
import { HttpCollection, HttpRequest } from "../../../models/model";
import Collection from "./Collections";

interface SidebarProps {
  collections: HttpCollection[];
}

class Sidebar extends React.Component<SidebarProps> {
  private collection: HttpCollection[];

  constructor(props: SidebarProps) {
    super(props);

    this.collection = props.collections;
  }

  render() {
    console.log("Sidebar render", this.collection);
    return (
      <div className="flex flex-col h-full relative">
        <h1>Sidebar</h1>
        <Collection collections={this.collection[0]} />
      </div>
    );
  }
}
export default Sidebar;
