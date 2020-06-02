import { getEntityValue, round } from '../utils/utils';

export default class IndicatorObject {
  constructor(entity, config, humidifier) {
    this.config = config || {};
    this.entity = entity || {};
    this.humidifier = humidifier || {};
  }

  get id() {
    return this.config.id;
  }

  get originalValue() {
    return getEntityValue(this.entity, this.config.source);
  }

  get value() {
    let value = this.originalValue;

    if (this.config.functions.mapper) {
      value = this.config.functions.mapper(value, this.entity,
        this.humidifier.entity);
    }

    if ('round' in this.config && Number.isNaN(value) === false)
      value = round(value, this.config.round);

    return value;
  }

  get unit() {
    return this.config.unit;
  }

  get icon() {
    if (this.config.functions.icon && this.config.functions.icon.template) {
      return this.config.functions.icon.template(this.value, this.entity,
        this.humidifier.entity);
    } else if (this.config.icon && typeof this.config.icon === 'string') {
      return this.config.icon;
    }

    return '';
  }

  get iconStyle() {
    if (this.config.functions.icon && this.config.functions.icon.style)
      return this.config.functions.icon.style(this.value, this.entity,
        this.humidifier.entity) || {};

    return {};
  }
}
