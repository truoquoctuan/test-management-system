import { useMutation, useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { GENERATE_KEY, UPLOAD_FILE } from 'apis/attachFile/attachFile';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MultipleFiles from './MultipleFiles';
import TestPlanAvatar from './TestPlanAvatar';
import UploadIssuse from './UploadIssuse';
import UserAvatar from './UserAvatar';

const AttachFile = (props) => {
    const [files, setFiles] = useState([]);
    const [isOpenAvatar, setIsOpenAvartar] = useState(false);
    const [uploadKey, setUploadKey] = useState('');
    const { data: keyData } = useQuery(GENERATE_KEY, { client: clientFile });
    const [uploadFile] = useMutation(UPLOAD_FILE, { client: clientFile });

    useEffect(() => {
        if (files.length > 0 && props?.setFileSeq && props?.checkSeq !== true) {
            props?.setFileSeq(files);
        }
    }, [files]);

    useEffect(() => {
        if (keyData) {
            setUploadKey(keyData.generateKey.key);
        }
    }, [keyData]);

    // eslint-disable-next-line no-unused-vars
    const [image, setImage] = useState(null);
    const handleDrop = async (acceptedFiles) => {
        const maxFileSize = parseInt(props?.filters?.max_file_size) * 1024 * 1024; // Convert MB to bytes
        const allowedExtensions = props?.filters?.mime_types[0]?.extensions.split(',');

        const validFiles = acceptedFiles.filter((file) => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                toast.error(`Invalid file format. `);
                return false;
            }
            if (file.size > maxFileSize) {
                toast.error(
                    `Sorry, the file you are trying to upload is too big (Maximum size is  ${props?.filters?.max_file_size})`
                );
                return false;
            }

            return true;
        });

        if (validFiles.length === 0) {
            console.log('No valid files to upload');
            return;
        }
        if (props.attachType === 'TestPlanAvatar') {
            try {
                for (const file of validFiles) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImage(e.target.result);
                        setIsOpenAvartar(true);
                    };
                    reader.readAsDataURL(file);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            try {
                for (const file of validFiles) {
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
                        setFiles((prevFiles) => [...prevFiles, data.uploadFile]);
                        props?.setFileSeq((prevFiles) => [...prevFiles, data.uploadFile]);
                    } catch (error) {
                        console.log('error', error);
                    }
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    if (props.attachType === 'TestPlanAvatar') {
        return (
            <TestPlanAvatar
                uploadKey={uploadKey}
                setUploadKey={setUploadKey}
                register={props.register}
                viewMode={props.viewMode}
                entity={props.entity}
                seq={props.seq}
                className={props.className}
                files={files}
                setFiles={setFiles}
                handleDrop={handleDrop}
                callBack={props?.callBack}
                defaultImage={props?.defaultImage}
                setIsOpenAvartar={setIsOpenAvartar}
                isOpenAvatar={isOpenAvatar}
                image={image}
                setFileSeq={props?.setFileSeq}
                uploadFile={uploadFile}
            />
        );
    } else if (props.attachType === 'UserAvatar') {
        return (
            <UserAvatar entity={props?.entity} seq={props?.seq} className={props?.className} keyProp={props?.keyProp} />
        );
    } else if (props.attachType === 'MultipleFiles') {
        return (
            <MultipleFiles
                uploadKey={uploadKey}
                register={props.register}
                viewMode={props.viewMode}
                mode={props.mode}
                entity={props.entity}
                seq={props.seq}
                className={props.className}
                files={files}
                setFiles={setFiles}
                handleDrop={handleDrop}
                fileSeq={props.fileSeq}
                setFileSeq={props.setFileSeq}
                displayType={props?.displayType}
            />
        );
    } else if (props.attachType === 'UploadIssuse') {
        return (
            <UploadIssuse
                uploadKey={uploadKey}
                register={props?.register}
                viewMode={props.viewMode}
                mode={props.mode}
                entity={props.entity}
                seq={props.seq}
                className={props.className}
                files={files}
                setFiles={setFiles}
                handleDrop={handleDrop}
                fileSeq={props.fileSeq}
                setFileSeq={props.setFileSeq}
            />
        );
    }
};

export default AttachFile;
