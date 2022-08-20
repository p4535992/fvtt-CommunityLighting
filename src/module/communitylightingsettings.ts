import CONSTANTS from './constants';

export class CommunityLightingSettings extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.title = game.i18n.localize('COMMUNITYLIGHTING.settings.title');
    options.id = 'community-lighting-settings';
    options.template = `modules/${CONSTANTS.MODULE_NAME}/templates/settings.html`;
    return options;
  }

  async getData() {
    const data: any = {};
    const src = ROUTE_PREFIX
      ? `/${ROUTE_PREFIX}/modules/${CONSTANTS.MODULE_NAME}/assets/lights.json`
      : `/modules/${CONSTANTS.MODULE_NAME}/assets/lights.json`;
    const resp = await fetch(src);
    if (resp.status !== 200) {
      console.warn(`Unable to load community lighting file: ${src}`);
    }
    const tempAuthorsObj = await resp
      .json()
      .then((json) => {
        console.log(`Loaded community lighting file: ${src}`);
        return json;
      })
      .catch((err) => {
        console.error(`Unable to parse community lighting file: ${err}`);
        return {};
      });
    if (tempAuthorsObj) {
      data.authors = Object.keys(tempAuthorsObj);
    }
    return data;
  }

  async _updateObject(event: Event, formData?: object): Promise<any> {
    // do nothing
  }
}
