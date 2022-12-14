import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { EmojiPicker as EmojiPickerAsync } from '../../ui/util/async-components';

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
  emoji_search: { id: 'emoji_button.search', defaultMessage: 'Search...' },
  people: { id: 'emoji_button.people', defaultMessage: 'People' },
  nature: { id: 'emoji_button.nature', defaultMessage: 'Nature' },
  food: { id: 'emoji_button.food', defaultMessage: 'Food & Drink' },
  activity: { id: 'emoji_button.activity', defaultMessage: 'Activity' },
  travel: { id: 'emoji_button.travel', defaultMessage: 'Travel & Places' },
  objects: { id: 'emoji_button.objects', defaultMessage: 'Objects' },
  symbols: { id: 'emoji_button.symbols', defaultMessage: 'Symbols' },
  flags: { id: 'emoji_button.flags', defaultMessage: 'Flags' },
});

const settings = {
  imageType: 'png',
  sprites: false,
  imagePathPNG: '/emoji/',
};

let EmojiPicker; // load asynchronously

@injectIntl
export default class EmojiPickerDropdown extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
  };

  state = {
    active: false,
    loading: false,
  };

  setRef = (c) => {
    this.dropdown = c;
  }

  handleChange = (data) => {
    this.dropdown.hide();
    this.props.onPickEmoji(data);
  }

  onShowDropdown = () => {
    this.setState({ active: true });
    if (!EmojiPicker) {
      this.setState({ loading: true });
      EmojiPickerAsync().then(TheEmojiPicker => {
        EmojiPicker = TheEmojiPicker.default;
        this.setState({ loading: false });
      }).catch(() => {
        // TODO: show the user an error?
        this.setState({ loading: false });
      });
    }
  }

  onHideDropdown = () => {
    this.setState({ active: false });
  }

  onToggle = (e) => {
    if (!this.state.loading && (!e.key || e.key === 'Enter')) {
      if (this.state.active) {
        this.onHideDropdown();
      } else {
        this.onShowDropdown();
      }
    }
  }

  onEmojiPickerKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.onHideDropdown();
    }
  }

  render () {
    const { intl } = this.props;

    const categories = {
      people: {
        title: intl.formatMessage(messages.people),
        emoji: 'smile',
      },
      nature: {
        title: intl.formatMessage(messages.nature),
        emoji: 'hamster',
      },
      food: {
        title: intl.formatMessage(messages.food),
        emoji: 'pizza',
      },
      activity: {
        title: intl.formatMessage(messages.activity),
        emoji: 'soccer',
      },
      travel: {
        title: intl.formatMessage(messages.travel),
        emoji: 'earth_americas',
      },
      objects: {
        title: intl.formatMessage(messages.objects),
        emoji: 'bulb',
      },
      symbols: {
        title: intl.formatMessage(messages.symbols),
        emoji: 'clock9',
      },
      flags: {
        title: intl.formatMessage(messages.flags),
        emoji: 'flag_gb',
      },
    };

    const { active, loading } = this.state;
    const title = intl.formatMessage(messages.emoji);

    return (
      <Dropdown ref={this.setRef} className='emoji-picker__dropdown' active={active && !loading} onShow={this.onShowDropdown} onHide={this.onHideDropdown}>
        <DropdownTrigger className='emoji-button' title={title} aria-label={title} aria-expanded={active} role='button' onKeyDown={this.onToggle} tabIndex={0} >
          <img
            className={`emojione ${active && loading ? 'pulse-loading' : ''}`}
            alt='????'
            src='/emoji/1f602.svg'
          />
        </DropdownTrigger>

        <DropdownContent className='dropdown__left'>
          {
            this.state.active && !this.state.loading &&
            (<EmojiPicker emojione={settings} onChange={this.handleChange} searchPlaceholder={intl.formatMessage(messages.emoji_search)} onKeyDown={this.onEmojiPickerKeyDown} categories={categories} search />)
          }
        </DropdownContent>
      </Dropdown>
    );
  }

}
