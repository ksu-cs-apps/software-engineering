import React, {Component} from 'react';
import {LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line} from 'recharts';
import moment from 'moment';

/** @class Burndown
  * A component for creating burndown charts of sprints
  */
export default class Burndown extends Component {
  /** @method render
    * Render the burndown chart.
    */
  render() {
    var totalPoints = 0;
    var days = [];
    var tips = [];
    // Find, apply, and count points for all issues
    var issues = this.props.issues.map((issue)=>{
      var match = /points:(\d+)/.exec(issue.body)
      var points = (match) ? parseInt(match[1],10) : 0;
      totalPoints += points;
      issue.points = points;
      return issue;
    });
    // Helper function to determine points in a day
    function pointsInDay(issues, day) {
      return issues.filter((issue)=>{
        // Look for issues closed on current day
        // we use dayOfYear as the basis for this
        // comparison, as our sprints are unlikely
        // to be longer than 265 days in length
        return moment(issue.closed_at).dayOfYear() === day.dayOfYear();
      }).reduce((acc, issue)=>{
        // Sum the points of issues closed that day
        return acc + issue.points;
      },0);
    }
    // Sort the issues into days of the sprint
    for(var day = moment(this.props.start); day <= moment(this.props.end); day.add(1, 'day')) {
      // Reduce the total points by the points of closed issues
      totalPoints -= pointsInDay(issues, day);
      days.push({
        name: day.format('M-D'),
        points: totalPoints
      });
      tips.push({
        name: day.format('Do, MM YYYY'),
        value: totalPoints,
        unit: 'points'
      });
    }
    return(
      <div>
        <h1>Burndown Chart</h1>
        <LineChart
          width={800}
          height={400}
          data={days}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="points" stroke="#ff7300" yAxisId={0} />
        </LineChart>
      </div>
    );
  }
}
