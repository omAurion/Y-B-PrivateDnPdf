# ga-react-router-component
Google analytics for react-router-component.

Based on [ga-react-router](https://github.com/tcoopman/ga-react-router)

## How to use

1. `npm install wali-s/ga-react-router-component`
2. In your `webpack.config.js` add `new webpack.DefinePlugin({GA_TRACKING_CODE: JSON.stringify('XXXXXXXX')})`
3. Use analytics in your routing code.

## Example

```js
'use strict';
var React = require('react');
var Router = require('react-router-component');
var GoogleAnalytics = require('ga-react-router-component');
var MainPage = require('../pages/index');
var UserPage = require('../pages/user');
var NotFound = require('../pages/not-found');

var App = React.createClass({
  trackPageview: function() {
    GoogleAnalytics.trackPageview();
  },
  componentDidMount: function() {
    this.trackPageview();
  },
  render: function() {
    return (
      <Router.Locations onNavigation={this.trackPageview}>
        <Router.Location path="/" handler={MainPage} />
        <Router.Location path="/users/:username" handler={UserPage} />
        <Router.NotFound handler={NotFoundPage} />
      </Router.Locations>
    )
  }
});
```
