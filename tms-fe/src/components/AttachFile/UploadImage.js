import { useMutation, useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { GENERATE_KEY, UPLOAD_FILE } from 'apis/attachFile/attachFile';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

const UploadImage = ({ insertToEditor }) => {
    const [uploadKey, setUploadKey] = useState('');
    const { data: keyData } = useQuery(GENERATE_KEY, { client: clientFile });
    const [uploadFile] = useMutation(UPLOAD_FILE, { client: clientFile });

    useEffect(() => {
        if (keyData) {
            setUploadKey(keyData.generateKey.key);
        }
    }, [keyData]);

    const handleDrop = async (acceptedFiles) => {
        try {
            for (const file of acceptedFiles) {
                try {
                    const { data } = await uploadFile({
                        variables: {
                            file: file,
                            uploadKey,
                            name: file.name,
                            chunk: 0,
                            chunks: 0
                        }
                    });
                    insertToEditor(data.uploadFile);
                } catch (error) {
                    console.log('error', error);
                }
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <div>{/* <div onClick={downloadFiles}>Download File</div> */}</div>

            <div className={`   `}>
                <div className="mt-4">
                    <div className="mt-2  gap-2">
                        <Dropzone onDrop={handleDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()} className=" ">
                                    <input {...getInputProps()} />
                                    <Icon name="file_image" />
                                </div>
                            )}
                        </Dropzone>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
