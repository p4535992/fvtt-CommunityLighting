import CONSTANTS from "./constants";

export class CLCustomPropertyManager {

    static async updateCustomProperties(updateData, lightAnimationChanges) {
        const customProperties = JSON.parse(JSON.stringify(lightAnimationChanges)); // Clone changes

        // Ensure we are not saving the data core stores in the db
        Object.keys(customProperties).forEach(key => {
            if (key == "type" || key == "intensity" || key == "speed") {
                delete customProperties[key];
            }
        });

        const placeableObject:Token | AmbientLight | undefined = canvas.lighting?.get(updateData.id) ?? canvas.tokens?.get(updateData.id);
        if (!customProperties || Object.getOwnPropertyNames(customProperties).length == 0) {
            // placeableObject.document.unsetFlag(CONSTANTS.MODULE_NAME, "customProperties");

            // No custom properties detected. Previously, we cleared the flags. However, with 0.8,
            // this is hit when intensity and/or speed only are changed, causing breakage on refresh.
            console.log("No C-prop")
        } else {
            //updateData.flags.CommunityLighting = {customProperties: customProperties};
            await placeableObject?.document?.setFlag(CONSTANTS.MODULE_NAME, "customProperties", customProperties);
        }
    }

    static async saveCustomProperties(data, flagsChanges) {
        const customProperties = JSON.parse(JSON.stringify(flagsChanges)); // Clone changes

        if (customProperties) {
            // Add customProperties from the flag into the lightAnimation object
            mergeObject(data._source.lightAnimation, customProperties)
            if (data._source.actor) {
                data._source.update({lightAnimation: customProperties.pointSource._source.data.lightAnimation}, {diff: false, loadedProperty: true})
            }
        }
    }

    static loadCustomProperties(pointSource) {
        if (!pointSource._source) {
            return; // Source is not cached yet, return
        }
        const customProperties = pointSource.object.getFlag(CONSTANTS.MODULE_NAME, "customProperties");

        // Remove any customProperties from the current lightAnimation object
        Object.keys(pointSource.object.data._source.lightAnimation).forEach(key => {
            if (key != "type" && key != "intensity" && key != "speed") {
                delete pointSource.object.data._source.lightAnimation[key];
            }
        });

        if (customProperties) {
            // Add customProperties from the flag into the lightAnimation object
            mergeObject(pointSource.object.data._source.lightAnimation, customProperties)
            if (pointSource.object.data._source.actor) {
                pointSource.object.data._source.update({lightAnimation: pointSource._source.lightAnimation}, {diff: false, loadedProperty: true})
            }
        }

    }

    static async removeAllCustomProperties(html) {
        html.find(".community-lighting-custom-property-noanim").remove();
        html.find(".community-lighting-custom-property").hide('normal', function () {
            $(this).remove();
        });
    }

    static async addCustomProperties(objectConfig, customPropertySibling, customAnimationProperties, animateShow = false) {
        const customAnimationPropertiesClone = JSON.parse(JSON.stringify(customAnimationProperties)); // Clone object so we can reverse it without reversing original
        const animation = objectConfig.object.data?.lightAnimation?._source || objectConfig.object.light.animation;

        function insertDescription(customPropertyObject){
            return customPropertyObject.description?`<p class="hint community-lighting-custom-property-noanim">${customPropertyObject.description}</p>`:''
        }

        customAnimationPropertiesClone.reverse().forEach((customPropertyObject) => {
            let currentValue;
            if (animation) {
                currentValue = animation[customPropertyObject.varName] ?? customPropertyObject.default;
            } else {
                currentValue = customPropertyObject.default;
            }

            switch (customPropertyObject.type) {
                case "speedDescription":{
                    if(currentValue){
                        const customPropertyEl = $(`<p class="hint community-lighting-custom-property-noanim">${currentValue}</p>`);
                        $('[name="lightAnimation.speed"]').parent().parent().append(customPropertyEl)
                    }
                    break;
                }
                case "intensityDescription":{
                    if(currentValue){
                        const customPropertyEl = $(`<p class="hint community-lighting-custom-property-noanim">${currentValue}</p>`);
                        $('[name="lightAnimation.intensity"]').parent().parent().append(customPropertyEl)
                    }
                    break;
                  }
                case "color":{
                    const customPropertyEl = $(
                        `<div class="form-group community-lighting-custom-property">
                            <label>${customPropertyObject.title}</label>
                            <input class="color" type="text" name="lightAnimation.${customPropertyObject.varName}" value="${currentValue}">
                            <input type="color" value="${currentValue}" data-edit="lightAnimation.${customPropertyObject.varName}">
                            ${insertDescription(customPropertyObject)}
                        </div>`)
                    if (animateShow) {
                        customPropertyEl.hide();
                    }
                    customPropertySibling.after(customPropertyEl);
                    if (animateShow) {
                        customPropertyEl.show(4000,'normal');
                    }
                    break;
                  }
                case "range":{
                    const customPropertyEl = $(
                        `<div class="form-group community-lighting-custom-property">
                        <label>${customPropertyObject.title}</label>
                        <div class="form-fields">
                            <input type="range" name="lightAnimation.${customPropertyObject.varName}" value="${currentValue}" min="${customPropertyObject.min}" max="${customPropertyObject.max}" step="${customPropertyObject.step}" data-dtype="Number">
                            <span class="range-value">${currentValue}</span>
                        </div>
                        ${insertDescription(customPropertyObject)}
                    </div>`);
                    if (animateShow) {
                        customPropertyEl.hide();
                    }
                    customPropertySibling.after(customPropertyEl);
                    if (animateShow) {
                        customPropertyEl.show(4000,'normal');
                    }
                    break;
                  }
                case "checkbox":{
                    const customPropertyEl = $(
                        `<div class="form-group community-lighting-custom-property">
                        <label>${customPropertyObject.title}</label>
                        <input type="checkbox" name="lightAnimation.${customPropertyObject.varName}" data-dtype="Boolean" ${currentValue ? "checked" : ""}>
                        ${insertDescription(customPropertyObject)}
                    </div>`);
                    if (animateShow) {
                        customPropertyEl.hide();
                    }
                    customPropertySibling.after(customPropertyEl);
                    if (animateShow) {
                        customPropertyEl.show(4000,'normal');
                    }

                    break;
                  }
                case "select":{
                    let options = '';
                    customPropertyObject.options.forEach(option => {
                        options += `<option value="${option.value}"${option.value == currentValue ? "selected" : ""}>${option.label}</option>`;
                    })
                    const customPropertyEl = $(
                        `<div class="form-group community-lighting-custom-property">
                        <label>${customPropertyObject.title}</label>
                        <div class="form-fields">
                            <select name="lightAnimation.${customPropertyObject.varName}">
                                ${options}
                            </select>
                        </div>
                        ${insertDescription(customPropertyObject)}
                    </div>`);
                    if (animateShow) {
                        customPropertyEl.hide();
                    }
                    customPropertySibling.after(customPropertyEl);
                    if (animateShow) {
                        customPropertyEl.show(4000,'normal');
                    }

                    break;
                  }
                default:{
                    break;
                }
            }
        })
    }

    static async addOptGroups(html) {
        // Find all start/end separators, get elements between and wrap them in an optgroup
        html.find("[value$='CommunityLightingSeparatorStart']").each((index, element) => {
            html.find(`[value='${element.innerText}CommunityLightingSeparatorStart']`).nextUntil(`[value='${element.innerText}CommunityLightingSeparatorEnd']`).wrapAll(`<optgroup label="${element.innerText}"></optgroup>`);
        });
        // Remove all original separators
        html.find("[value$='CommunityLightingSeparatorStart']").remove();
        html.find("[value$='CommunityLightingSeparatorEnd']").remove();
    }

    static async onRenderTokenOrLightConfig(objectConfig, html, data) {
        if(objectConfig.object.documentName === 'AmbientLight'){
            objectConfig.options.closeOnSubmit = game.settings.get(CONSTANTS.MODULE_NAME, "closeLightOnSubmit");
        } else if (objectConfig.object.documentName === 'Token'){
            objectConfig.options.closeOnSubmit = game.settings.get(CONSTANTS.MODULE_NAME, "closeTokenOnSubmit");
        }
        const animTypeSelector = html.find("[name='lightAnimation.type']"); // Get the animation type selector element
        const customPropertySibling = html.find('[name="lightAnimation.intensity"]').parent().parent(); // Get the div holding the intensity slider so we can add our props after it
        CLCustomPropertyManager.addOptGroups(html);
        // Grab the current value, and set any custom properties up
        let customAnimationProperties = (<any>CONFIG.Canvas.lightAnimations[animTypeSelector.val()])?.customProperties;

        CLCustomPropertyManager.removeAllCustomProperties(html);

        if (customAnimationProperties && customAnimationProperties.length > 0) {
            CLCustomPropertyManager.addCustomProperties(objectConfig.object, customPropertySibling, customAnimationProperties);
        }

        // When the type changes, set up any custom properties
        animTypeSelector.on('change', function () {
            CLCustomPropertyManager.removeAllCustomProperties(html);
            customAnimationProperties = (<any>CONFIG.Canvas.lightAnimations[this.value])?.customProperties;
            if (customAnimationProperties && customAnimationProperties.length > 0) {
                CLCustomPropertyManager.addCustomProperties(objectConfig.object, customPropertySibling, (<any>CONFIG.Canvas.lightAnimations[this.value]).customProperties, true);
            }
        });
    }

    static onPreUpdateLightOrToken(updateData, options, user) {
        if (options.lightAnimation) {
            CLCustomPropertyManager.updateCustomProperties(updateData, options.lightAnimation);
        }
    }

    static onUpdateLightOrToken(doc, changes, diff, user) {
        if(!changes?.flags?.CommunityLighting){
            if(doc.documentName === 'AmbientLight' && doc.sheet._state == DocumentSheet.RENDER_STATES.RENDERING && game.settings.get(CONSTANTS.MODULE_NAME, "closeLightOnSubmit") === false){
                ui.notifications.notify(game.i18n.localize("COMMUNITYLIGHTING.notif.lightUpdated"));
            } else if (doc.documentName === 'Token' && changes.lightAnimation && game.settings.get(CONSTANTS.MODULE_NAME, "closeTokenOnSubmit") === false){
                ui.notifications.notify(game.i18n.localize("COMMUNITYLIGHTING.notif.tokenUpdated"));
            }
        }
        if (changes?.flags?.CommunityLighting?.customProperties) {
            CLCustomPropertyManager.saveCustomProperties(doc.data, changes.flags.CommunityLighting.customProperties);
        }
    }

}
