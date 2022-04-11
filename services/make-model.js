const apiURL = 'https://uc-dev-core-apim.azure-api.net/vsp/qa';

export const getMakes = async () => {
    try {
        const response = await fetch(`${apiURL}/makes?newCarOnly=true`);
        return response.json();
    } catch {
        return [];
    }
}

export const getModelsByMake = async (seoMakeName) => {
    try {
        const response = await fetch(`${apiURL}/newcar/models/${seoMakeName}`);
        return response.json();
    } catch {
        return [];
    }
}

export const getModelInfo = async (seoMakeName, seoModelName, year) => {
    try {
        const response = await fetch(`${apiURL}/model/${seoMakeName}/${seoModelName}/${year}`);
        return response.json();
    } catch {
        return {};
    }
}

export const getYearsByMakeModel = async (seoMakeName, seoModelName) => {
    try {
        const response = await fetch(`${apiURL}/modelyears/${seoMakeName}/${seoModelName}?newCarOnly=true`);
        return response.json();
    } catch {
        return [];
    }
}

export const getModelReview = async (seoMakeName, seoModelName, year) => {
    try {
        const response = await fetch(`${apiURL}/modelReview/${seoMakeName}/${seoModelName}/${year}?includeLatestIfNotFound=false`);
        return response.json();
    } catch {
        return [];
    }
}