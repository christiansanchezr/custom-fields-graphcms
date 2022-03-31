import { config } from "../utilities/config";

export const getMakes = async () => {
    try {
        const response = await fetch(`${config.vspUrl}/makes?newCarOnly=true`);
        return response.json();
    } catch {
        return [];
    }
}

export const getModelsByMake = async (seoMakeName) => {
    try {
        const response = await fetch(`${config.vspUrl}/newcar/models/${seoMakeName}`);
        return response.json();
    } catch {
        return [];
    }
}

export const getYearsByMakeModel = async (seoMakeName, seoModelName) => {
    try {
        const response = await fetch(`${config.vspUrl}/modelyears/${seoMakeName}/${seoModelName}?newCarOnly=true`);
        return response.json();
    } catch {
        return [];
    }
}