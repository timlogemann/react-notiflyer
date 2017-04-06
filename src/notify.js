import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

const notificationWrapperId = 'notification-wrapper';

/* React Notification Component */
class Toast extends Component {
	static propTypes = {
		text: PropTypes.string,
		timeout: PropTypes.number,
		animationDuration: PropTypes.number,
		type: PropTypes.string,
		color: PropTypes.object,
    button: PropTypes.object,
    unMount: PropTypes.func,
		style: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.bool,
		]),
	};

	constructor(props) {
    super(props);

		this.state = {
			state: 'inactive',
		};
	}

	componentWillMount() {
		this.timeout = setTimeout(() => {
      this.setState({ state: 'active' });
      this.timeout = null;
      /*
      setTimeout(() => {
				hideToast();
      });
      */
    }, 100);
	}

	componentDidMount() {
		this.timeout = setTimeout(() => {
      this.setState({ state: 'inactive' });
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
		const { text = '', button, type = '' } = this.props;
		const { state } = this.state;

		return (
			<div className={`snackbar ${type} ${state}`}>
        <div className="snack-content">
          <p>{text}</p>
        </div>
        {button ?
					<div className="snack-action">
						<button
							className="button"
							onClick={button.action}
						>
							<span>{button.label}</span>
						</button>
					</div>
        : null}
    </div>
		);
	}
}

/* Private Functions */

/* Render React component */
function renderToast(type = null, text = null, timeout = null,
position = null, button = { label: '', action: null }) {
	ReactDOM.render(
		<Toast
			text={text}
			timeout={timeout}
			type={type}
			position={position}
			button={button}
		/>,
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
function show({
	type,
	text = null,
	timeout = 3000,
	position = null,
	button = { label: null, action: null },
}) {
	if (!document.getElementById(notificationWrapperId).hasChildNodes()) {
		// Render Component with Props.
		renderToast(type, text, timeout, position, button);

		if (timeout === -1) {
			return false;
		}

		// Unmount react component after the animation finished.
		setTimeout(function() {
			hideToast();
		}, timeout + 110);

    return true;
	}

	return false;
}

function error({
	text = null,
	timeout = null,
	position = null,
	button = null,
}) {
	show({
		type: 'error',
		text,
		timeout,
		position,
		button,
	});
}

function success({
	text = null,
	timeout = null,
	position = null,
	button = null,
}) {
	show({
		type: 'success',
		text,
		timeout,
		position,
		button,
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
                setTimeout(() => this.showNotify(), current.timeout + 0);
            }
        } else {
            // If message show failed, re-add the current message to the front of the queue
            this.msgs.unshift(current);
            setTimeout(() => this.showNotify(), this.currentRecallDelay);
            this.currentRecallDelay += recallDelayIncrement;
        }
    };

    return (text, type = '', timeout = 1000, color = colorWhite) => {
        this.msgs.push({ text, type, timeout, color });
        if (!this.isNotifying) {
            this.showNotify();
        }
    };
}

/* Export notification container */
export default class extends Component {
  static propTypes = {
    children: PropTypes.object,
    timeout: PropTypes.number,
    position: PropTypes.string,
  };

	render() {
		const { children, timeout, position } = this.props;
		return (
			<div id={notificationWrapperId}>
				{React.Children.map(children, child =>
          React.cloneElement(child, {
            timeout,
            position,
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
  createShowQueue,
};
