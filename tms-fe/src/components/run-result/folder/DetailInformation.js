import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import AttachFile from 'components/AttachFile/AttachFile';
import { customStyles } from 'components/common/FormatModal';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import { GET_FOLDER_BY_ID } from '../../../apis/repository/folder';
import { toDateStrings, toDateTimeString } from '../../common/ConvertTime';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';

// eslint-disable-next-line no-unused-vars
const DetailInformation = ({ isOpen, setIsOpen, idFolder }) => {
    const { data: dataDetail } = useQuery(GET_FOLDER_BY_ID, { client: clientRepo, variables: { id: idFolder } });
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };
    return (
        <div>
            {' '}
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isClosing={isClosing}
                style={customStyles}
                setIsClosing={setIsClosing}
                chooseOut={true}
            >
                <div className="mb-3 max-h-[900px] min-h-[424px] w-[680px] p-6">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">Detail Information</p>
                        <div onClick={() => handleClose()} className="cursor-pointer">
                            <Icon name="close" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="border bg-[#F4F4F4] p-2 text-sm font-semibold">Folder Name</p>
                        <p className="border-x border-b p-2 text-sm font-normal text-[#787878]">
                            {dataDetail?.getFolderById?.folderName}
                        </p>
                    </div>
                    <div className="">
                        <p className="border-x bg-[#F4F4F4] p-2 text-sm font-semibold">Description</p>
                        <div className="custom-scroll-y max-h-[250px] border p-2">
                            {dataDetail?.getFolderById?.description === '<p><br></p>' ||
                            dataDetail?.getFolderById?.description === '' ? (
                                <div className="text-sm">No description available</div>
                            ) : (
                                <ReactQuill
                                    theme="snow"
                                    id="objective"
                                    className="react-quill-hidden-calendar "
                                    value={dataDetail?.getFolderById?.description}
                                    readOnly={true}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex border-x border-b  ">
                        <div className=" w-full  ">
                            <p className="border-b bg-[#F4F4F4] p-2 font-semibold">Creator</p>
                            <div className="mt-1 flex gap-2 p-2">
                                <AttachFile
                                    attachType="UserAvatar"
                                    entity="user"
                                    seq={dataDetail?.getFolderById?.createdBy}
                                    className="h-10 w-10 rounded-full object-cover"
                                    keyProp={dataDetail?.getFolderById?.createdBy}
                                />
                                <div>
                                    <p className="text-sm font-medium">{dataDetail?.getFolderById?.fullName}</p>
                                    <p className="text-sm text-[#787878]">@{dataDetail?.getFolderById?.userName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" flex  border-x border-b">
                        <div className=" w-[50%] border-r">
                            <p className="border-b bg-[#F4F4F4] p-2 font-semibold">Created at</p>
                            <div className=" flex gap-2 p-2">
                                <p className="text-sm text-[#787878]">
                                    {toDateStrings(dataDetail?.getFolderById?.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className=" w-[50%]">
                            <p className="border-b bg-[#F4F4F4] p-2 font-semibold">Updated at</p>
                            <div className=" flex gap-2 p-2">
                                <p className="text-sm text-[#787878]">
                                    {toDateTimeString(dataDetail?.getFolderById?.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default DetailInformation;
