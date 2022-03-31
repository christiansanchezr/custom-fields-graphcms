import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getModelsByMake } from "../../services/make-model";

const ModelField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const [ models, setModels ] = useState([]);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {

                    console.log(state);
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
    
    return <select value={value} onChange={({ target: { value: val } }) => onChange(val)}>
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