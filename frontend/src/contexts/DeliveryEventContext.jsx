import { createContext } from 'react';
export const DeliveryEventContext = createContext({ reloadFlag: false, triggerReload: () => {} }); 