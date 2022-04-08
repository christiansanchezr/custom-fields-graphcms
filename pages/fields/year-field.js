import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getYearsByMakeModel } from "../../services/make-model";

const YearsField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const { form: {getState} } = useFormSidebarExtension();

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
    
    return <select style={{ padding: '7px', width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} value={value} onChange={({ target: { value: val } }) => onChange(val)}>
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