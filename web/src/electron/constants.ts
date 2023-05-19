export const isElectron = navigator.userAgent.toLowerCase().indexOf('electron') >= 0;
export const isPackedElectron = isElectron && window.app.isPacked();
