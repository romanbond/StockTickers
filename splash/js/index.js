'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _React = React;
var Component = _React.Component;

/**
 * Crest
 */

var Crest = function (_Component) {
  _inherits(Crest, _Component);

  function Crest() {
    _classCallCheck(this, Crest);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Crest.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var _props = this.props;
    var count = _props.count;
    var center = _props.center;
    var circleSize = _props.circleSize;
    var offset = _props.offset;
    var radius = _props.radius;
    var delay = _props.delay;

    var offsetToC = offsetTo(center);
    var theta = 2 * Math.PI / count;
    var delta = offset ? theta / 2 : 0;

    Array(count).fill().forEach(function (_, idx) {
      var start = getLocation(theta, delta, idx, radius, offsetToC);
      var end = getLocation(theta, delta, idx, radius * 0.5, offsetToC);

      TweenMax.fromTo(_this2.refs[idx], 1, {
        attr: { r: circleSize, cx: start.x, cy: start.y }
      }, {
        attr: { r: circleSize / 8, cx: end.x, cy: end.y },
        ease: Sine.easeInOut,
        delay: delay,
        yoyo: true,
        repeat: -1
      });
    });
  };

  Crest.prototype.render = function render() {
    var _props2 = this.props;
    var count = _props2.count;
    var circleSize = _props2.circleSize;
    var radius = _props2.radius;
    var center = _props2.center;
    var offset = _props2.offset;
    var fill = _props2.fill;

    var theta = 2 * Math.PI / count;
    var delta = offset ? theta / 2 : 0;
    var nodes = Array(count).fill();

    return React.createElement(
      'g',
      null,
      getCircles(theta, delta, radius, circleSize, fill, center, nodes)
    );
  };

  return Crest;
}(Component);

Crest.propTypes = {
  count: React.PropTypes.number.isRequired,
  circleSize: React.PropTypes.number.isRequired,
  center: React.PropTypes.object.isRequired,
  fill: React.PropTypes.string.isRequired,
  offset: React.PropTypes.bool.isRequired
};

function getCircles(theta, delta, radius, circleR, fill, center, nodes) {
  var offsetToC = offsetTo(center);

  return nodes.map(function (_, idx) {
    var l = getLocation(theta, delta, idx, radius, offsetToC);
    return React.createElement('circle', { key: idx,
      ref: idx,
      cx: l.x, cy: l.y,
      r: circleR,
      fill: fill,
      strokeWidth: circleR * 0.2 });
  });
}

function getLocation(theta, delta, idx, r, offsetToC) {
  return polarToCartesian(delta + theta * idx, r, offsetToC);
}

function polarToCartesian(theta, r, offsetToC) {
  var x = r * Math.cos(theta);
  var y = r * Math.sin(theta);
  return offsetToC({ x: x, y: y });
}

function offsetTo(center) {
  return function offsetToC(_ref) {
    var x = _ref.x;
    var y = _ref.y;

    return {
      x: center.x + x,
      y: center.y - y
    };
  };
}

/**
 * Canvas
 */

var Nucleus = function (_Component2) {
  _inherits(Nucleus, _Component2);

  function Nucleus() {
    _classCallCheck(this, Nucleus);

    return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
  }

  Nucleus.prototype.componentDidMount = function componentDidMount() {
    var r = this.props.r;

    TweenMax.fromTo(this.refs.circle, 1, {
      attr: { r: r }
    }, {
      attr: { r: r / 8 },
      ease: Sine.easeInOut,
      yoyo: true,
      repeat: -1
    });
  };

  Nucleus.prototype.render = function render() {
    var _props3 = this.props;
    var x = _props3.x;
    var y = _props3.y;
    var r = _props3.r;
    var fill = _props3.fill;

    return React.createElement('circle', { ref: 'circle',
      cx: x, cy: y,
      r: r,
      fill: fill });
  };

  return Nucleus;
}(Component);

Nucleus.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  r: React.PropTypes.number.isRequired,
  fill: React.PropTypes.string.isRequired
};

/**
 * Canvas
 */
function Canvas(_ref2) {
  var w = _ref2.w;
  var h = _ref2.h;
  var children = _ref2.children;
  var _ref2$bgColor = _ref2.bgColor;
  var bgColor = _ref2$bgColor === undefined ? 'transparent' : _ref2$bgColor;

  var viewBox = [0, 0, w, h].join(' ');
  var styles = {
    display: 'block',
    backgroundColor: bgColor,
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto'
  };

  return React.createElement(
    'svg',
    { version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: viewBox,
      style: styles },
    children
  );
}

Canvas.propTypes = {
  h: React.PropTypes.number.isRequired,
  w: React.PropTypes.number.isRequired,
  children: React.PropTypes.node,
  bgColor: React.PropTypes.string
};

/**
 * App
 */
var s = 200;
var center = { x: s / 2, y: s / 2 };
var circleColor = '#fff';
var circleSize = 3;
var amp = 12;
var crests = [{ count: 8, offset: false }, { count: 16, offset: false }, { count: 16, offset: true }, { count: 16, offset: false }, { count: 16, offset: true }, { count: 16, offset: false }];

var styles = {
  link: {
    color: 'white',
    position: 'fixed',
    right: '1rem',
    bottom: '1rem',
    textDecoration: 'none',
    letterSpacing: '0.1em'
  },
  container: {
    backgroundColor: '#1684FB',
    height: '100vh'
  }
};

var App = function (_Component3) {
  _inherits(App, _Component3);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _Component3.apply(this, arguments));
  }

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      { style: styles.container,
        className: 'bg-black vh-100 flex items-center' },
      React.createElement(
        'a',
        { style: styles.link,
          href: 'https://github.com/winkerVSbecks/splash',
          target: '_blank' },
        'GITHUB'
      ),
      React.createElement(
        Canvas,
        { w: s, h: s },
        React.createElement(Nucleus, { x: center.x, y: center.y,
          r: circleSize,
          fill: circleColor }),
        crests.map(function (_ref3, idx) {
          var count = _ref3.count;
          var offset = _ref3.offset;
          return React.createElement(Crest, { key: idx,
            count: count,
            circleSize: circleSize,
            radius: amp + amp * idx,
            center: center,
            offset: offset,
            delay: 0.8 * (idx + 1) / crests.length,
            fill: circleColor });
        })
      )
    );
  };

  return App;
}(Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
