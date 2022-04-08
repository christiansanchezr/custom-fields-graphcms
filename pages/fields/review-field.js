import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getModelReview } from "../../services/make-model";

const ReviewField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const { form: {getState} } = useFormSidebarExtension();

    const [ review, setReview ] = useState(null);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {
                    console.log(state.values);
                    if (state.values.makeField != null && state.values.modelField != null && state.values.yearField != null) {
                        const reviewResponse = await getModelReview(state.values.makeField, state.values.modelField, state.values.yearField);
                        setReview(reviewResponse);
                    }
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState])

    const formState = async () => {

        const { values } = await getState();

        if (values.reviewField != null) {
            const reviewResponse = await getModelReview(values.makeField, values.modelField, values.yearField);
            setReview(reviewResponse);
        }
    }

    useEffect(() => {
        formState();
    }, [])
    
    return <textarea rows={8} style={{ width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} defaultValue={review != null ? review.modelOverview : ''} value={value} onChange={({ target: { value: val } }) => onChange(val)}>
        {review != null ? review.modelOverview : ''}
    </textarea>
}

const ReviewFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.STRING,
    features: [FieldExtensionFeature.ListRenderer, FieldExtensionFeature.FieldRenderer],
    name: 'Review field',
}

const Extension = () => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    return (
        <Wrapper uid={extensionUid} declaration={ReviewFieldDeclaration}>
            <ReviewField/>
        </Wrapper>
    )
}

export default Extension;