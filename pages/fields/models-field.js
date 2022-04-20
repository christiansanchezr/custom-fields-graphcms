import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getModelsByMake } from "../../services/make-model";

const ModelField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const { form: {getState} } = useFormSidebarExtension();

    const [ models, setModels ] = useState([]);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {
                    if (state.values.makeField != null) {
                        const modelsResponse = await getModelsByMake(state.values.makeField);
                        setModels(modelsResponse);
                    }

                    
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState])

    const formState = async () => {

        const { values } = await getState();

        if (values.modelField != null) {
            const modelsResponse = await getModelsByMake(values.makeField);
            setModels(modelsResponse);
        }
    }

    useEffect(() => {
        formState();
    }, [])
    
    return <select style={{ padding: '7px', width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} value={value != null ? value : ''} onChange={({ target: { value: val } }) => onChange(val)}>
        <option value='' key="0">Select a model</option>
        {models.map((model, index) => (
            <option value={model.seoName} key={index} id={model.seoName}>{model.name}</option>
        ))}
    </select>
}

const ModelsFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.STRING,
    features: [FieldExtensionFeature.ListRenderer, FieldExtensionFeature.FieldRenderer],
    name: 'Model field',
}

const Extension = () => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    return (
        <Wrapper uid={extensionUid} declaration={ModelsFieldDeclaration}>
            <ModelField/>
        </Wrapper>
    )
}

export default Extension;