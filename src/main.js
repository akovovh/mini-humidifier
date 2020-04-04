import { LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import HumidifierObject from './model';
import style from './style';
import sharedStyle from './sharedStyle';

import './components/dropdown';
import './components/powerstrip';

import {
  ICON,
} from './const';

if (!customElements.get('ha-slider')) {
  customElements.define(
    'ha-slider',
    class extends customElements.get('paper-slider') {},
  );
}

// eslint-disable-next-line no-unused-vars
class MiniHumidifier extends LitElement {
  constructor() {
    super();
    this.initial = true;
    this.edit = false;
  }

  static get properties() {
    return {
      _hass: {},
      config: {},
      entity: {},
      humidifier: {},
      initial: Boolean,
      edit: Boolean,
    };
  }

  static get styles() {
    return [
      sharedStyle,
      style,
    ];
  }

  set hass(hass) {
    if (!hass) return;
    const entity = hass.states[this.config.entity];
    this._hass = hass;

    if (entity && this.entity !== entity) {
      this.entity = entity;
      this.humidifier = new HumidifierObject(hass, this.config, entity);
    }
  }

  get hass() {
    return this._hass;
  }

  get name() {
    return this.config.name || this.humidifier.name;
  }

  setConfig(config) {
    if (!config.entity || config.entity.split('.')[0] !== 'fan')
      throw new Error('Specify an entity from within the fan domain.');

    const conf = {
      toggle_power: true,
      ...config,
    };
    this.config = conf;
  }

  // eslint-disable-next-line no-unused-vars
  render({ config } = this) {
    return html`
      <ha-card
        class=${this.computeClasses()}
        style=${this.computeStyles()}>
        <div class='mh__bg'>
        </div>
        <div class='mh-humidifier'>
          <div class='mh-humidifier__core flex'>
            ${this.renderIcon()}

            <div class='entity__info'>
              ${this.renderEntityName()}
            </div>
            <mh-powerstrip
              .hass=${this.hass}
              .humidifier=${this.humidifier}
              .config=${config}>
            </mh-powerstrip>
          </div>

        </div>
        <div class='mmp__container'>
          ${this.humidifier.active ? html`
         
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  renderIcon() {
    const state = this.humidifier.isActive;

    return html`
      <div class='entity__icon' ?color=${state}>
        <ha-icon .icon=${this.computeIcon()} ></ha-icon>
      </div>`;
  }

  renderEntityName() {
    return html`
      <div class='entity__info__name'>
        ${this.name}
      </div>`;
  }

  computeIcon() {
    return this.config.icon ? this.config.icon : this.humidifier.icon || ICON.DEFAULT;
  }

  computeClasses({ config } = this) {
    return classMap({
      '--initial': this.initial,
      '--collapse': config.collapse,
      '--inactive': !this.humidifier.isActive,
    });
  }

  computeStyles() {
    const { scale } = this.config;
    return styleMap({
      ...(scale && { '--mh-unit': `${40 * scale}px` }),
    });
  }
}

customElements.define('mini-humidifier', MiniHumidifier);
