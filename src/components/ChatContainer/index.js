import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, setPropTypes } from 'recompose';

import MessageList from '../MessageList';
import InputArea from '../InputArea';

const mapStateToProps = ({ connection }) => {
    return { connection };
};

const enhance = compose(
    setPropTypes({
        theme: PropTypes.shape({
            ImageComponent: PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func
            ]),
            InputComponent: PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func
            ]),
            MessageComponent: PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func
            ]),
            TextComponent: PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func
            ])
        })
    }),
    connect(mapStateToProps)
);

export class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    componentDidCatch(error, info) {
        // TODO: Refactor this to dispatch a
        // friendly message to the chat UI.
        // Currently, we simply do not render the UI.
        this.setState({ hasError: true });
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) return <React.Fragment></React.Fragment>;

        return (
            <div className="ChatContainer">
                <MessageList theme={this.props.theme} />
                <InputArea {...this.props.theme} />
            </div>
        );
    }
}

export default enhance(ChatContainer);
