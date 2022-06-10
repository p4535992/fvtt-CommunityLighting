
import { registerSocket } from './socket';
import CONSTANTS from './constants';
import API from './api';
import { CommunityLighting } from './communitylighting';
import { setApi } from '../main';

export const initHooks = (): void => {
  // registerSettings();
  // registerLibwrappers();
  // new HandlebarHelpers().registerHelpers();

  Hooks.once('socketlib.ready', registerSocket);

  CommunityLighting.onInit();

};

export const setupHooks = (): void => {
  setApi(API);
};

export const readyHooks = (): void => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);
  CommunityLighting.onReady();
};



const module = {
  //
};
