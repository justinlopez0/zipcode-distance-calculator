import { Component } from "react";

export class DistanceList extends Component {
  constructor(props) {
      super(props);
      console.log(this.props.distances);
  }

  formatMiles(n) {
    return Math[n < 0 ? 'ceil' : 'floor'](n);
  }

  render() {
    return <div>
        <h2>{this.props.distances.length} Distances</h2>
      <ul key={this.props.distances}>
      { this.props.distances.map(distance => {
          return <li>{distance.start + ' -> ' + distance.end} is {this.formatMiles(distance.distance)} miles.</li>
      }) }
      </ul>
    </div>
  }
}