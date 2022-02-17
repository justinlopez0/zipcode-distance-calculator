import { Component } from "react";
import { DistanceList } from "./DistanceList";

export class ZipCodeCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCodes: '',
      coordinates: [],
      distances: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchCordinates() {
    // Clear any existing distances
    this.setState({ distances: [] });

    fetch(`http://localhost/api/zip-codes/get-coordinates/${this.state.zipCodes}`)
      .then(response => response.json())
      .then(coordinates => {
        this.setState({coordinates: coordinates});

        // Calculate distances
        for (let i = 0; i < this.state.coordinates.length; i++) {
          // If there is no next destination, just break
          if (typeof this.state.coordinates[i+1] == 'undefined') break;

          let start = this.state.coordinates[i];
          let end = this.state.coordinates[i+1];

          let distance = this.calcDistance(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude
          );

          this.setState({
            distances: [...this.state.distances, {
              start: start.zip_code,
              end: end.zip_code,
              distance: distance
            }]
          });
        }
      });
  }
  
  /**
   * @see https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
   */
  calcDistance(lat1, lon1, lat2, lon2) {
    var R = 3963; // Miles
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;

    return d;
  }

  /**
   * Converts numeric degrees to radians
   */
  toRad(value) {
      return value * Math.PI / 180;
  }

  handleChange(event) {
    this.setState({zipCodes: event.target.value})
  }

  handleSubmit(event) {
    this.fetchCordinates();
    event.preventDefault();
  }

  render() {
    return <div>
        <h1>Calculate Distance Between Zip Codes</h1>
        <p>Enter a comma delimited list of zipcodes to get the distance between each one</p>
        <p>Example: 45426,90801,90804</p>
        <form>
          <input type="text" 
            value={this.state.zipCodes} 
            onChange={this.handleChange} />
          
          <input type="submit" onClick={this.handleSubmit} />
        </form>

        <DistanceList key={this.state.distances} distances={this.state.distances} />
      </div>
  }
}