/**
 * Community Lighting by Blitz
 * Lighting animations for 0.7.x
 */

import { CLAnimationManager } from './animationmanager';
import { CLAudioReactor } from './audioreact';
import { CommunityLightingSettings } from './communitylightingsettings';
import CONSTANTS from './constants';
import { CLMonkeyPatcher } from './monkeypatcher';

export class CommunityLighting {
  static animationManager;

  // static handlebarsHelpers = {
  //     "communitylighting-parseauthors": (obj) => {
  //         const authors = Object.keys(obj);
  //         let data = "";
  //         authors.forEach((author) => {
  //             data += `<p>${author}</p>
  //             `;
  //         })
  //         return data;
  //     }
  // }

  // static async onInit() {

  //     // Get all community lights
  //     // Add settings to disable specific lights from selection

  //     CommunityLighting.animationManager = new CLAnimationManager();
  //     await CommunityLighting.animationManager.registerAnimations();

  //     Handlebars.registerHelper(CommunityLighting.handlebarsHelpers);

  // }

  // static async onReady() {
  //     CLAudioReactor.startAnalysis()
  //     // Patching and using libWrapper if available
  //     CLMonkeyPatcher.runPatches()
  // }
}
