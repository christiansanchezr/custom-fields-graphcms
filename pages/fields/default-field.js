import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";

const DefaultField = () => {
    const { value, onChange } = useFieldExtension(); 

    return <input type='checkbox' value={value} onChange={({ target: { value: val } }) => onChange(val)}></input>
}

const DefaultFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.BOOLEAN,
    features: [FieldExtensionFeature.ListRenderer, FieldExtensionFeature.FieldRenderer],
    name: 'Default Field'
}

const Extension = ({ makes }) => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    return (
        <Wrapper uid={extensionUid} declaration={DefaultFieldDeclaration}>
            <DefaultField/>
        </Wrapper>
    )
}

export default Extension;