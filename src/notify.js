import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

/* React Notification Component */
class Toast extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		timeout: PropTypes.number,
		type: PropTypes.string,
		color: PropTypes.object,
		style: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.bool
		])
	};

	constructor(props) {
		this.state = {
			active: false,
		}
	}

	componentWillMount() {
		this.timeout = setTimeout(() => {
      this.setState({ active: true });
      this.timeout = null;
    }, 100);
	}

	componentDidMount() {
		this.timeout = setTimeout(() => {
      this.setState({ active: false });
      this.timeout = null;
    }, this.props.timeout);
	}

	componentWillUnmount() {
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

	render() {
		let { text, button, type = '' } = this.props;
		return (
			<div className={`snackbar ${type}`}>
	      <div className="snack-content">
	        <p>{text}</p>
	      </div>
	      <div className="snack-action">
	        <button
	          label={button.label}
	          onClick={button.action}
	        />
	      </div>
    </div>
		);
	}
}

/* Private Functions */

/* Render React component */
function renderToast(type = null, text = null, timeout = null, position = null, action = null) {
	ReactDOM.render(
		<Toast text={text} timeout={timeout} type={type} position={position} action={action} />,
		document.getElementById(notificationWrapperId)
	);
}

/* Unmount React component */
function hideToast() {
	ReactDOM.unmountComponentAtNode(document.getElementById(notificationWrapperId));
}

/* Public functions */

/* Show Animated Toast Message */
/* Returns true if the toast was shown, or false if show failed due to an existing notification */
function show({ text = null, timeout = null, position = null, action = null }) {
	if (!document.getElementById(notificationWrapperId).hasChildNodes()) {
		let renderTimeout = timeout || null;

		// Render Component with Props.
		renderToast(type, text, renderTimeout, position, action);

		if (timeout === -1) {
			return false;
		}

		// Unmount react component after the animation finished.
		setTimeout(function() {
			hideToast();
		}, renderTimeout + animationDuration);

    return true;
	}

	return false;
}

function error({ text = null, timeout = null, position = null, action = null }) {
	show({
		type: 'error',
		text,
		timeout,
		position,
		action
	});
}

function success({ text = null, timeout = null, position = null, action = null }) {
	show({
		type: 'success',
		text,
		timeout,
		position,
		action
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
function createShowQueue(initialRecallDelay = 500, recallDelayIncrement = 500) {
    // Array to hold queued messages
    this.msgs = [];

    // Is the showNotify function in progress - used so we can call showNotify when a
    // message is added to an empty queue.
    this.isNotifying = false;

    this.currentRecallDelay = initialRecallDelay;

    // Retrieve the next message from the queue and try to show it
    this.showNotify = () => {
        // If there are no messages in the queue
        if (this.msgs.length === 0) {
            this.isNotifying = false;
            return;
        }

        this.isNotifying = true;

        const current = this.msgs.pop();

        // show will now return true if it is able to send the message,
        // or false if there is an existing message
        if (show(current.text, current.type, current.timeout, current.color)) {
            this.currentRecallDelay = initialRecallDelay;
            if (current.timeout > 0) {
                setTimeout(() => this.showNotify(), current.timeout + animationDuration);
            }
        } else {
            // If message show failed, re-add the current message to the front of the queue
            this.msgs.unshift(current);
            setTimeout(() => this.showNotify(), this.currentRecallDelay);
            this.currentRecallDelay += recallDelayIncrement;
        }
    };

    return (text, type = '', timeout = defaultTimeout, color = colorWhite) => {
        this.msgs.push({text, type, timeout, color});
        if (!this.isNotifying) {
            this.showNotify();
        }
    };
}

/* Export notification container */
export default class extends React.Component {
	render() {
		const { timeout, position, animationDuration } = this.props;
		return (
			<div id={notificationWrapperId}>
				{React.Children.map(children, child =>
          React.cloneElement(child, {
            timeout,
            position,
            animationDuration,
          })
        )}
			</div>
		);
	}
}

/* Export notification functions */
export let notifly = {
	show,
	error,
	success,
  createShowQueue
};
