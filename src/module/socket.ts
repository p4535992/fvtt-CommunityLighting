import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../main';

export let communityLightingSocket;

export function registerSocket() {
  debug('Registered communityLightingSocket');
  if (communityLightingSocket) {
    return communityLightingSocket;
  }
  //@ts-ignore
  communityLightingSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
  setSocket(communityLightingSocket);
  return communityLightingSocket;
}
