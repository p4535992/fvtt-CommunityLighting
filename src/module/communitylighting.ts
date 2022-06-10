/**
 * Community Lighting by Blitz
 * Lighting animations for 0.7.x
 */

import { CLAnimationManager } from "./animationmanager";
import { CLAudioReactor } from "./audioreact";
import { CommunityLightingSettings } from "./communitylightingsettings";
import CONSTANTS from "./constants";
import { CLMonkeyPatcher } from "./monkeypatcher";

export class CommunityLighting {

    static animationManager;

    static handlebarsHelpers = {
        "communitylighting-parseauthors": (obj) => {
            const authors = Object.keys(obj);
            let data = "";
            authors.forEach((author) => {
                data += `<p>${author}</p>
                `;
            })
            return data;
        }
    }

    static async onInit() {

        // Get all community lights
        // Add settings to disable specific lights from selection

        CommunityLighting.animationManager = new CLAnimationManager();
        await CommunityLighting.animationManager.registerAnimations();

        game.settings.registerMenu(CONSTANTS.MODULE_NAME, "mySettingsMenu", {
            name: game.i18n.localize("COMMUNITYLIGHTING.settings.name"),
            label: game.i18n.localize("COMMUNITYLIGHTING.settings.label"),
            icon: "fas fa-lightbulb",
            type: CommunityLightingSettings,
            restricted: true
        });
        game.settings.register(CONSTANTS.MODULE_NAME, 'closeLightOnSubmit', {
            name: game.i18n.localize('COMMUNITYLIGHTING.settings.closeLightOnSubmit.name'),
            hint: game.i18n.localize('COMMUNITYLIGHTING.settings.closeLightOnSubmit.hint'),
            scope: 'client',
            config: true,
            type: Boolean,
            default: true
        });
        game.settings.register(CONSTANTS.MODULE_NAME, 'closeTokenOnSubmit', {
            name: game.i18n.localize('COMMUNITYLIGHTING.settings.closeTokenOnSubmit.name'),
            hint: game.i18n.localize('COMMUNITYLIGHTING.settings.closeTokenOnSubmit.hint'),
            scope: 'client',
            config: true,
            type: Boolean,
            default: true
        });

        Handlebars.registerHelper(CommunityLighting.handlebarsHelpers);

    }

    static async onReady() {
        CLAudioReactor.startAnalysis()
        // Patching and using libWrapper if available
        CLMonkeyPatcher.runPatches()
    }
}
