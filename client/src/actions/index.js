export const initializeEnigma = (enigma) => {
    return {
        type: 'ENIGMA_INITIALIZED',
        payload: enigma
    };
};

export const initializeAccounts = (accounts) => {
    return {
        type: 'ACCOUNTS_INITIALIZED',
        payload: accounts
    };
};

export const deployDataValidation = (deployedDataValidation) => {
    return {
        type: 'ANKER_PRIVACY_TOOLS_DEPLOYED',
        payload: deployedDataValidation
    };
};

export const notifyMessage = (notification) => {
    return {
        type: 'MESSAGE_NOTIFIED',
        payload: notification
    };
};
