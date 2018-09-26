import React from 'react';
import { render } from 'react-dom';

import { createStoreWithState } from './store';
import { merge } from 'lodash';

import { Provider } from 'react-redux';
import smoothscroll from 'smoothscroll-polyfill';

import ChatContainer from './components/ChatContainer';

import * as actionTypes from './actionTypes';
import RWCFeersumClient from 'rwc-feersum-client';
import NetworkManager from './utils/network';
import defaultTheme from './themes/default';
import defaultConfig from './config';

smoothscroll.polyfill();
/**
 * The main react component for React Web Chat
 * @param {Object} params - An object containing configuration parameters
 * @param {Object} params.theme - Custom theme
 * @param {String} params.url - Chat server url to post messages to
 * @param {Object} params.client - Which client to use for network communication
 * @param {Object} params.typingStatus - A list of configuration options for the typing status indicator
 * @param {Object} params.network - A list of configuration options for network communication
 * @return {Object} React component
 */
export const ReactWebChatComponent = ({
    theme,
    avatar,
    client,
    url,
    typingStatus,
    network,
    menu = {}
}) => {
    const store = createStoreWithState({
        config: merge(
            {},
            defaultConfig,
            { typingStatus },
            { network },
            { menu },
            { avatar }
        )
    });
    const networkManager = new NetworkManager({
        store,
        client:
            client ||
            new RWCFeersumClient({
                url,
                config: {
                    channel_id: network.channel_id,
                    address: network.address,
                    startNew: network.startNew,
                    retransmissionTimeout: network.retransmissionTimeout || 500,
                    retransmissionMaxTimeout: network.retransmissionMaxTimeout,
                    retransmissionAttempts: network.retransmissionAttempts,
                    schemaVersion: network.schemaVersion,
                    menu: menu
                }
            })
    });
    networkManager.init();
    return (
        <Provider store={store}>
            <ChatContainer theme={{ ...defaultTheme, ...theme }} />
        </Provider>
    );
};

/**
 * The wrapping constructor module which renders {@link ReactWebChatComponent} to the target element
 */
class ReactWebChat {
    constructor(
        { theme, avatar, client, element, url, typingStatus, network, menu } = {
            theme: defaultTheme,
            avatar,
            client,
            element,
            url: 'http://localhost:8080/echo',
            typingStatus,
            network,
            menu
        }
    ) {
        if (element && element.nodeName) {
            /**
             * @type {Element}
             */
            this.element = element;
            /**
             * @type {Object}
             */
            this.client = client;
            this.bindEventsToActions();

            render(
                <ReactWebChatComponent
                    theme={theme}
                    avatar={avatar || 'http://i.pravatar.cc/300'}
                    client={client}
                    url={url}
                    typingStatus={typingStatus}
                    network={network}
                    menu={menu}
                />,
                element
            );
        } else {
            console.error(
                'React Web Chat: expected element passed to constructor to be a DOM node. Received instead: ',
                element
            );
        }
    }

    bindEventsToActions() {
        Object.values(actionTypes).map(type =>
            window.addEventListener(
                `rwc-dispatch-${type}`,
                ({ detail: { payload } }) =>
                    store.dispatch({
                        type,
                        payload
                    })
            )
        );
    }
}

export default ReactWebChat;
