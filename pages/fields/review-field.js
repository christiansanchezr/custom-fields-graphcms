import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getModelReview } from "../../services/make-model";

const ReviewField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState } } = useFieldExtension(); 

    const [ review, setReview ] = useState(null);

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {

                    if (state.values.makeField != null && state.values.modelsField != null && state.values.yearField != null) {
                        const reviewResponse = await getModelReview(state.values.makeField, state.values.modelsField, state.values.yearField);
                        console.log(reviewResponse)
                        setReview(reviewResponse);
                    }
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState])
    
    return <textarea rows={8} style={{ width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} value={review != null ? review.modelOverview : ''} onChange={({ target: { value: val } }) => onChange(val)}>
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