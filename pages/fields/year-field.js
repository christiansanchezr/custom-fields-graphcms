import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getYearsByMakeModel } from "../../services/make-model";

const YearsField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const [ years, setYears ] = useState([]);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {

                    if (state.values.makeField !== null && state.values.modelsField != null) {
                        const yearsResponse = await getYearsByMakeModel(state.values.makeField, state.values.modelsField);
                        setYears(yearsResponse);
                    }
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState])
    
    return <select value={value} onChange={({ target: { value: val } }) => onChange(val)}>
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