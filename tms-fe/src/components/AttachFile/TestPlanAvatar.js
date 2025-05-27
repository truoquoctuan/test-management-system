import { useMutation, useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { DELETE_FILE_BY_SEQ, DISPLAY_IMG, GET_LIST_FILE_BY_GROUP_ID } from 'apis/attachFile/attachFile';
import AvatarImage from 'assets/images/Image.svg';
import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { toast } from 'sonner';

const TestPlanAvatar = ({
    uploadKey,
    register,
    viewMode,
    seq,
    setFiles,
    className,
    files,
    handleDrop,
    entity,
    // eslint-disable-next-line no-unused-vars
    callBack,
    defaultImage,
    image,
    uploadFile,
    setIsOpenAvartar,
    isOpenAvatar,
    setFileSeq
}) => {
    const { data: imgData } = useQuery(DISPLAY_IMG, {
        client: clientFile,
        variables: { seq: files ? parseInt(files[files?.length - 1]?.fileSeq) : null },
        skip: parseInt(files[files?.length - 1]?.fileSeq) ? false : true
    });

    const { data: listFileByGroupId, refetch } = useQuery(GET_LIST_FILE_BY_GROUP_ID, {
        client: clientFile,
        variables: { id: `${entity}-${seq}` },
        skip: seq ? false : true
    });

    function getFirstCharacter(str, defaultChar = 'B') {
        str = str?.trimStart();
        if (!str) return defaultChar;
        return str.charAt(0);
    }
    let firstCharacter = getFirstCharacter(defaultImage);

    const [imageSrc, setImageSrc] = useState(null);
    useEffect(() => {
        if (callBack !== undefined) {
            refetch();
        }
    }, [callBack]);
    useEffect(() => {
        setImageSrc(null);
        if (imgData && imgData.displayImg) {
            setImageSrc(`data:${imgData.displayImg.contentType};base64,${imgData.displayImg.base64Image}`);
        }
    }, [imgData]);

    useEffect(() => {
        if (listFileByGroupId) {
            setFiles(listFileByGroupId?.getListFileByGroupId);
        }
    }, [listFileByGroupId]);

    // Xóa ảnh
    const [deleteSeq] = useMutation(DELETE_FILE_BY_SEQ, { client: clientFile });
    const handleRemove = async (seq) => {
        try {
            await deleteSeq({ variables: { id: seq } });
            await refetch();
            setFiles([]);
            setImageSrc(null);
            toast.success('Photo deleted successfully');
        } catch (error) {
            toast.error('Error');
        }
    };

    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);
    const handleSave = async () => {
        if (editor) {
            const canvas = editor.getImageScaledToCanvas();
            const imgDataUrl = canvas.toDataURL();
            const file = dataURLtoFile(imgDataUrl, 'avatar.png');

            try {
                const { data } = await uploadFile({
                    variables: {
                        file: file,
                        uploadKey: uploadKey, // Replace with your actual upload key
                        name: file.name,
                        chunk: 0,
                        chunks: 0
                    }
                });
                setFiles((prevFiles) => [...prevFiles, data.uploadFile]);
                if (setFileSeq) {
                    setFileSeq((prevFiles) => [...prevFiles, data.uploadFile]);
                }
                toast.success('Profile picture updated successfully');
                setIsOpenAvartar(false);
            } catch (error) {
                toast.error('Failed to upload profile picture');
            }
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpenAvartar(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div>
            {viewMode ? (
                <div className={` flex  gap-2`}>
                    {uploadKey !== '' && <input type="hidden" {...register('uploadKey', { value: uploadKey })} />}

                    <div>
                        {imageSrc ? (
                            <img src={imageSrc} alt="User Avatar" className="h-[96px] w-[96px] " key={seq} />
                        ) : (
                            <img src={AvatarImage} alt="User Avatar" className="avatar-image" />
                        )}
                    </div>

                    <div className="mt-4">
                        <p className="font-medium">Test Plan avatar</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Dropzone onDrop={handleDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className="h-[36px] w-[126px] border border-[#787878] text-center"
                                    >
                                        <input {...getInputProps()} />
                                        <p className="h-full translate-y-[20%] cursor-pointer text-sm font-semibold text-[#787878]">
                                            Choose file
                                        </p>
                                    </div>
                                )}
                            </Dropzone>
                            {/* {image && ( */}

                            <ModalComponent
                                isOpen={isOpenAvatar}
                                setIsOpen={setIsOpenAvartar}
                                isClosing={isClosing}
                                setIsClosing={setIsClosing}
                                style={customStyles}
                            >
                                <div className=" p-3">
                                    <div className="flex justify-between border-b pb-4">
                                        <p className="text-lg font-semibold"> Avatar Customization</p>
                                        <div onClick={() => handleClose()}>
                                            <Icon name="close" className="h-4 w-4 " />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <AvatarEditor
                                            ref={(ref) => setEditor(ref)}
                                            image={image}
                                            width={250}
                                            height={250}
                                            border={50}
                                            scale={scale}
                                        />
                                    </div>

                                    <div className="mb-2 mt-2">
                                        <label htmlFor="scale">Zoom:</label>
                                        <input
                                            type="range"
                                            id="scale"
                                            name="scale"
                                            min="1"
                                            max="2"
                                            step="0.01"
                                            value={scale}
                                            onChange={(e) => setScale(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <hr />
                                    <div className="flex justify-end gap-2">
                                        <div
                                            onClick={() => handleClose()}
                                            className=" mt-2 w-[120px] cursor-pointer border border-primary-1 px-2 py-1 text-center text-sm text-black"
                                        >
                                            Cancel
                                        </div>
                                        <div
                                            onClick={handleSave}
                                            className=" mt-2 w-[120px] cursor-pointer bg-primary-1 px-2 py-1 text-center  text-sm text-white"
                                        >
                                            Confirm
                                        </div>
                                    </div>
                                </div>
                            </ModalComponent>

                            {/* )} */}
                            {imgData ? (
                                <div className="flex gap-2">
                                    <p>{imgData?.displayImg?.fileName}</p>
                                    <div className="remove-button" onClick={() => handleRemove(files[0]?.fileSeq)}>
                                        <Icon
                                            name="close_circle"
                                            className="h-3.5 w-3.5 cursor-pointer text-state-error"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[#787878]">No file chosen.</p>
                            )}
                        </div>
                        <p className="text-sm text-[#787878]">
                            Click here to upload a new picture. Max size: 10MB. Recommended dimensions: 96x96 pixels.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="">
                    {' '}
                    {imageSrc ? (
                        <img src={imageSrc} alt="User Avatar" className={` ${className}`} />
                    ) : (
                        <p
                            className={` flex items-center justify-center border bg-[#ececef] text-lg font-semibold ${className}`}
                        >
                            {firstCharacter.toUpperCase()}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestPlanAvatar;
