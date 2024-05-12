import * as React from "react";
import { HttpCollection, HttpRequest } from "../../../../models/model";

interface CollectionProps {
  collections: HttpCollection;
}

class Collection extends React.Component<CollectionProps> {
  collection: HttpCollection;

  constructor(props: CollectionProps) {
    super(props);
    this.collection = props.collections;
    console.log("Collection constructor", this.collection);
    this.collection.requests.map((request) => {
      console.log(request);
    });
  }

  render() {
    console.log("Collection render", this.collection.requests[0]);
    var requests = this.collection.requests;

    const requestsList = requests.map((request) => (
      <li>
        {request.name} : {request.method} {request.url}
      </li>
    ));

    return (
      <div>
        <h1>{this.collection.name}</h1>
        <ul>{requestsList}</ul>
      </div>
    );
  }
}

export default Collection;
