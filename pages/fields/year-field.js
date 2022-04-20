import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getYearsByMakeModel, getModelInfo } from "../../services/make-model";
import { config } from "../../utilities/config";

const YearsField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const { form: {getState, change} } = useFormSidebarExtension();

    const [ years, setYears ] = useState([]);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {
                    if (state.values.makeField !== null && state.values.modelField != null) {
                        const yearsResponse = await getYearsByMakeModel(state.values.makeField, state.values.modelField);
                        setYears(yearsResponse);
                    }
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState]);


    const formState = async () => {

        const { values } = await getState();

        if (values.yearField != null) {
            const yearsResponse = await getYearsByMakeModel(values.makeField, values.modelField);
            setYears(yearsResponse);
        }
    }

    useEffect(() => {
        formState();
    }, [])

    const changeValue = async (val) => {
        onChange(val);

        /*
        const { values } = await getState();
        const modelResponse = await getModelInfo(values.makeField, values.modelField, val);
        if (values.imageField == null) {
            const uploadAsset = await fetch(`https://api-us-east-1.graphcms.com/v2/ckpr4gqzskmhu01w6asxnb4bk/master/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${config.graphcmsToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodeURIComponent(modelResponse.imageMedium)}`
            });
            const uploadAssetResponse = await uploadAsset.json();
            change('imageField', uploadAssetResponse);
        
        }
        */
    }
    
    return <select style={{ padding: '7px', width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} value={value != null ? value : ''} onChange={({ target: { value: val } }) => changeValue(val)}>
        <option value='' key="0">Select year</option>
        {years.map((year, index) => (
            <option value={year} key={index+1}>{year}</option>
        ))}
    </select>
}

const ModelsFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.STRING,
    features: [FieldExtensionFeature.ListRenderer, FieldExtensionFeature.FieldRenderer],
    name: 'Year field',
}

const Extension = () => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    return (
        <Wrapper uid={extensionUid} declaration={ModelsFieldDeclaration}>
            <YearsField/>
        </Wrapper>
    )
}

export default Extension;