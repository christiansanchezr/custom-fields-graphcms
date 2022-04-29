import { FieldExtensionFeature, FieldExtensionType, useFieldExtension, useFormSidebarExtension, useUiExtension, Wrapper } from "@graphcms/uix-react-sdk"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getModelInfo } from "../../services/make-model";
import { config } from "../../utilities/config";

const ImageField = () => {
    const { value, onChange, form: { subscribeToFieldState, subscribeToFormState }, context: { environment: { endpoint, authToken }, }, } = useFieldExtension(); 
    const { form: {getState} } = useFormSidebarExtension();

    const [ image, setImage ] = useState('');

    const changeAsset = (val) => {
        onChange(val);
        console.log(val);
    }

    useEffect(() => {
        const unsubscribe = async () => {
            await subscribeToFormState(
                async (state) => {

                    if (state.values.makeField !== null && state.values.modelField != null && state.values.yearField != null) {
                        const modelResponse = await getModelInfo(state.values.makeField, state.values.modelField, state.values.yearField);
                        setImage(modelResponse.imageMedium);
                        if (state.values.imageField == null) {
                            console.log(config.graphcmsToken);
                            const uploadAsset = await fetch(`https://api-us-east-1.graphcms.com/v2/ckpr4gqzskmhu01w6asxnb4bk/master/upload`, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${config.graphcmsToken}`,
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: `url=${encodeURIComponent(modelResponse.imageMedium)}`
                            });
                            const uploadAssetResponse = await uploadAsset.json();
                            const refetchedAsset = await fetchAsset({
                             id: uploadAssetResponse.id,
                             endpoint,
                             authToken,
                            }).then((r) => r.json());
                            console.log({ uploadedAsset, refetchedAsset });
                            changeAsset(refetchedAsset.data.asset);
                        }
                    }
                },
                { dirty: true, invalid: true, values: true }
            );
        }
        return () => unsubscribe();
    }, [subscribeToFieldState])

    const formState = async () => {

        const { values } = await getState();

        if (values.imageField != null) {
            setImage(values.imageField.url);
        }
    }

    useEffect(() => {
        formState();
    }, [])
    
    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <img src={image} style={{ maxWidth: '256px' }}/>
        <input type='file' style={{ padding: '7px', width: '100%', color: 'rgb(9, 14, 36)', border: '1px solid rgb(218, 222, 237)', lineHeight: '24px', fontSize: '15px', boxShadow: 'rgb(0 0 0 / 5%) 0px 2px 4px' }} onChange={({ target: { value: val } }) => changeAsset(val)}/>

    </div>
}

function fetchAsset({ id, endpoint, authToken }) {
  const query = `query uploadedAsset($id: ID!) {
    asset(where: {id: $id}) {
      __typename
      id
      stage
      updatedAt
      handle
      fileName
      mimeType
      width
      height
      size
      url
      documentInStages(includeCurrent: true) {
        id
        stage
        updatedAt
      }
    }
  }`;
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        id,
      },
    }),
  });
}

const ModelsFieldDeclaration = {
    extensionType: 'field',
    fieldType: FieldExtensionType.ASSET,
    features: [
        FieldExtensionFeature.ListRenderer, 
        FieldExtensionFeature.FieldRenderer, 
        FieldExtensionFeature.TableRenderer
    ],
    name: 'Image field',
}

const Extension = () => {
    const router = useRouter();

    const {extensionUid} = router.query;

    if (!extensionUid) return null;

    return (
        <Wrapper uid={extensionUid} declaration={ModelsFieldDeclaration}>
            <ImageField/>
        </Wrapper>
    )
}

export default Extension;
