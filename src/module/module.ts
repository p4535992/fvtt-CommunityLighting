import { registerSocket } from './socket';
import CONSTANTS from './constants';
import API from './api';
import { CommunityLighting } from './communitylighting';
import { setApi } from '../main';
import { CLMonkeyPatcher } from './monkeypatcher';
import { CLAnimationManager } from './animationmanager';
import { CLAudioReactor } from './audioreact';

export const initHooks = async (): Promise<void> => {
  // registerSettings();
  // registerLibwrappers();
  // new HandlebarHelpers().registerHelpers();

  Hooks.once('socketlib.ready', registerSocket);

  // CommunityLighting.onInit();

  // Get all community lights
  // Add settings to disable specific lights from selection

  CommunityLighting.animationManager = new CLAnimationManager();
  await CommunityLighting.animationManager.registerAnimations();

  // Handlebars.registerHelper(CommunityLighting.handlebarsHelpers);
};

export const setupHooks = (): void => {
  setApi(API);
};

export const readyHooks = (): void => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);
  // CommunityLighting.onReady();

  CLAudioReactor.startAnalysis();
  // Patching and using libWrapper if available
  CLMonkeyPatcher.runPatches();
};
