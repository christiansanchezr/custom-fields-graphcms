import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMakes, getModelsByMake } from "../../services/make-model";

const MakesField = ({ makes }) => {
    const { value, onChange } = useFieldExtension(); 

    const changeValue = (val) => {
        console.log(val);
        onChange(val);
    }

    return <select style={{ padding: '7px', width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} value={value != null ? value : ''} onChange={({ target: { value: val } }) => changeValue(val)}>
        <option value='' key="0">Select a make</option>
        {makes.map((make, index) => (
            <option value={make.seoName} key={index} id={make.seoName}>{make.name}</option>
        ))}
    </select>
}

const MakesFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.STRING,
    features: [FieldExtensionFeature.ListRenderer, FieldExtensionFeature.FieldRenderer],
    name: 'Make Field'
}

const Extension = ({ makes }) => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    console.log(makes);

    return (
        <Wrapper uid={extensionUid} declaration={MakesFieldDeclaration}>
            <MakesField makes={makes}/>
        </Wrapper>
    )
}

export const getStaticProps = async () => {
    const makesResponse = await getMakes();

    return {
        props: {
            makes: makesResponse || []
        }
    }
}

export default Extension;