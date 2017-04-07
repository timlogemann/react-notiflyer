'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notifly = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var notificationWrapperId = 'notification-wrapper';

/* React Notification Component */

var Toast = function (_Component) {
	_inherits(Toast, _Component);

	function Toast(props) {
		_classCallCheck(this, Toast);

		var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this, props));

		_this.state = {
			state: 'inactive'
		};
		return _this;
	}

	_createClass(Toast, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			this.timeout = setTimeout(function () {
				_this2.setState({ state: 'active' });
				_this2.timeout = null;
			}, 100);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			this.timeout = setTimeout(function () {
				_this3.setState({ state: 'inactive' });
				_this3.timeout = null;
			}, this.props.timeout);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
		}

		/*
  getVisibleState(context) {
  	setTimeout(function() {
  		this.setState({
  			active: true,
  		})
  	}, 100); // wait 100ms after the component is called to animate toast.
  		if (this.props.timeout === -1) {
  		return;
  	}
  		setTimeout(function() {
  		this.setState({
  			active: false,
  		})
  	}, this.props.timeout);
  }
  */

	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    _props$text = _props.text,
			    text = _props$text === undefined ? '' : _props$text,
			    button = _props.button,
			    _props$type = _props.type,
			    type = _props$type === undefined ? '' : _props$type;
			var state = this.state.state;

			return _react2.default.createElement(
				'div',
				{ className: 'snackbar ' + type + ' ' + state },
				_react2.default.createElement(
					'div',
					{ className: 'snack-content' },
					_react2.default.createElement(
						'p',
						null,
						text
					)
				),
				button ? _react2.default.createElement(
					'div',
					{ className: 'snack-action' },
					_react2.default.createElement(
						'button',
						{
							className: 'button',
							onClick: button.action
						},
						_react2.default.createElement(
							'span',
							null,
							button.label
						)
					)
				) : null
			);
		}
	}]);

	return Toast;
}(_react.Component);

/* Private Functions */

/* Render React component */


Toast.propTypes = {
	text: _react.PropTypes.string,
	timeout: _react.PropTypes.number,
	animationDuration: _react.PropTypes.number,
	type: _react.PropTypes.string,
	color: _react.PropTypes.object,
	button: _react.PropTypes.object,
	style: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.bool])
};
function renderToast() {
	var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	var button = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { label: '', action: null };

	_reactDom2.default.render(_react2.default.createElement(Toast, {
		text: text,
		timeout: timeout,
		type: type,
		position: position,
		button: button
	}), document.getElementById(notificationWrapperId));
}

/* Unmount React component */
function hideToast() {
	_reactDom2.default.unmountComponentAtNode(document.getElementById(notificationWrapperId));
}

/* Public functions */

/* Show Animated Toast Message */
/* Returns true if the toast was shown, or false if show failed due to an existing notification */
function show(_ref) {
	var type = _ref.type,
	    _ref$text = _ref.text,
	    text = _ref$text === undefined ? null : _ref$text,
	    _ref$timeout = _ref.timeout,
	    timeout = _ref$timeout === undefined ? 3000 : _ref$timeout,
	    _ref$position = _ref.position,
	    position = _ref$position === undefined ? null : _ref$position,
	    _ref$button = _ref.button,
	    button = _ref$button === undefined ? { label: null, action: null } : _ref$button;

	if (!document.getElementById(notificationWrapperId).hasChildNodes()) {
		// Render Component with Props.
		renderToast(type, text, timeout, position, button);

		if (timeout === -1) {
			return false;
		}

		// Unmount react component after the animation finished.
		setTimeout(function () {
			hideToast();
		}, timeout + 10);

		return true;
	}

	return false;
}

function error(_ref2) {
	var _ref2$text = _ref2.text,
	    text = _ref2$text === undefined ? null : _ref2$text,
	    _ref2$timeout = _ref2.timeout,
	    timeout = _ref2$timeout === undefined ? null : _ref2$timeout,
	    _ref2$position = _ref2.position,
	    position = _ref2$position === undefined ? null : _ref2$position,
	    _ref2$button = _ref2.button,
	    button = _ref2$button === undefined ? null : _ref2$button;

	show({
		type: 'error',
		text: text,
		timeout: timeout,
		position: position,
		button: button
	});
}

function success(_ref3) {
	var _ref3$text = _ref3.text,
	    text = _ref3$text === undefined ? null : _ref3$text,
	    _ref3$timeout = _ref3.timeout,
	    timeout = _ref3$timeout === undefined ? null : _ref3$timeout,
	    _ref3$position = _ref3.position,
	    position = _ref3$position === undefined ? null : _ref3$position,
	    _ref3$button = _ref3.button,
	    button = _ref3$button === undefined ? null : _ref3$button;

	show({
		type: 'success',
		text: text,
		timeout: timeout,
		position: position,
		button: button
	});
}

/**
 * Add to Animated Toast Message Queue
 * Display immediately if no queue
 * @param  {Number} initialRecallDelay   If the call to show fails because of an existing
 *                                       notification, how long to wait until we retry (ms)
 * @param  {Number} recallDelayIncrement Each time a successive call fails, the recall delay
 *                                       will be incremented by this (ms)
 * @return {[type]}                      [description]
 */
function createShowQueue() {
	var _this4 = this;

	var initialRecallDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
	var recallDelayIncrement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	// Array to hold queued messages
	this.msgs = [];

	// Is the showNotify function in progress - used so we can call showNotify when a
	// message is added to an empty queue.
	this.isNotifying = false;

	this.currentRecallDelay = initialRecallDelay;

	// Retrieve the next message from the queue and try to show it
	this.showNotify = function () {
		// If there are no messages in the queue
		if (_this4.msgs.length === 0) {
			_this4.isNotifying = false;
			return;
		}

		_this4.isNotifying = true;

		var current = _this4.msgs.pop();

		// show will now return true if it is able to send the message,
		// or false if there is an existing message
		if (show(current.text, current.type, current.timeout, current.color)) {
			_this4.currentRecallDelay = initialRecallDelay;
			if (current.timeout > 0) {
				setTimeout(function () {
					return _this4.showNotify();
				}, current.timeout + 0);
			}
		} else {
			// If message show failed, re-add the current message to the front of the queue
			_this4.msgs.unshift(current);
			setTimeout(function () {
				return _this4.showNotify();
			}, _this4.currentRecallDelay);
			_this4.currentRecallDelay += recallDelayIncrement;
		}
	};

	return function (text) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
		var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : colorWhite;

		_this4.msgs.push({ text: text, type: type, timeout: timeout, color: color });
		if (!_this4.isNotifying) {
			_this4.showNotify();
		}
	};
}

/* Export notification container */

var _class = function (_Component2) {
	_inherits(_class, _Component2);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			var _props2 = this.props,
			    children = _props2.children,
			    timeout = _props2.timeout,
			    position = _props2.position;

			return _react2.default.createElement(
				'div',
				{ id: notificationWrapperId },
				_react2.default.Children.map(children, function (child) {
					return _react2.default.cloneElement(child, {
						timeout: timeout,
						position: position
					});
				})
			);
		}
	}]);

	return _class;
}(_react.Component);

/* Export notification functions */


_class.propTypes = {
	children: _react.PropTypes.object,
	timeout: _react.PropTypes.number,
	position: _react.PropTypes.string
};
exports.default = _class;
var notifly = exports.notifly = {
	show: show,
	error: error,
	success: success,
	createShowQueue: createShowQueue
};