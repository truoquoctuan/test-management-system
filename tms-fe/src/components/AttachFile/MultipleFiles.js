import { useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { DISPLAY_IMG } from 'apis/attachFile/attachFile';
import { checkFileFormat } from 'components/common/FileFormat';
import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import NoImage from '../../assets/images/doc.svg';

const MultipleFiles = ({ viewMode, handleDrop, fileSeq, setFileSeq, displayType }) => {
    const handleRemove = (seq) => {
        const dataDelete = fileSeq?.filter((item) => item.fileSeq !== seq);
        setFileSeq(dataDelete);
    };
    const [isOpenFileSeq, setIsOpenSeq] = useState(null);
    const [errorIndices, setErrorIndices] = useState({});
    const [seqs, setSeqs] = useState(null);
    const [isOpenHover, setIsOpenHover] = useState(false);
    const [imgPreview, setImgPreview] = useState(null);

    const { data: imgData } = useQuery(DISPLAY_IMG, {
        client: clientFile,
        variables: { seq: seqs }
    });
    const fileData = imgData?.displayImg;

    const downloadFile = () => {
        // Xử lý dữ liệu base64: loại bỏ khoảng trắng không mong muốn
        const cleanedBase64 = fileData.base64Image.replace(/\s/g, '');
        // Decode base64 thành dữ liệu nhị phân
        const byteCharacters = atob(cleanedBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // Tạo blob từ dữ liệu nhị phân
        const blob = new Blob([byteArray], { type: fileData.contentType });
        // Tạo URL cho blob
        const downloadUrl = URL.createObjectURL(blob);
        // Tạo một thẻ <a> ẩn để tải xuống file
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileData.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Giải phóng URL blob
        URL.revokeObjectURL(downloadUrl);
    };
    useEffect(() => {
        if (imgData) {
            downloadFile();
        }
    }, [imgData]);
    const [isClosing, setIsClosing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };
    return (
        <div>
            <div>{/* <div onClick={downloadFiles}>Download File</div> */}</div>

            <div className={`   `}>
                <div className="m-1">
                    {displayType ? (
                        <div className=" flex flex-wrap gap-2">
                            {fileSeq?.map((item, index) => {
                                return (
                                    <div
                                        className="relative mt-2 h-[140px] w-[156px] justify-between gap-3"
                                        key={index}
                                        onMouseOver={() => {
                                            setIsOpenHover(true);
                                            setIsOpenSeq(item?.fileSeq);
                                        }}
                                        onMouseLeave={() => setIsOpenHover(false)}
                                    >
                                        <div className="relative h-full gap-2 border">
                                            <div
                                                className={`flex ${
                                                    errorIndices[item?.fileSeq] ? 'h-[110px]' : ''
                                                } items-center justify-center bg-[#F4F4F4]`}
                                            >
                                                <img
                                                    // eslint-disable-next-line no-undef
                                                    src={`${process.env.REACT_APP_SERVICE_IMAGE}/${item?.fileSeq}`}
                                                    onError={(e) => {
                                                        e.target.src = NoImage;
                                                        setErrorIndices((prevState) => ({
                                                            ...prevState,
                                                            [item?.fileSeq]: true
                                                        }));
                                                    }}
                                                    className={`object-cover ${
                                                        errorIndices[item?.fileSeq]
                                                            ? 'h-[30px] w-[25px]'
                                                            : 'h-[140px] w-[156px]'
                                                    }`}
                                                />
                                                {isOpenHover &&
                                                    isOpenFileSeq === item?.fileSeq &&
                                                    !errorIndices[item?.fileSeq] && (
                                                        <div
                                                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 text-white"
                                                            onClick={() => {
                                                                setIsOpen(true);
                                                                setImgPreview(item?.fileSeq);
                                                            }}
                                                        >
                                                            Preview
                                                        </div>
                                                    )}
                                            </div>

                                            {errorIndices[item?.fileSeq] ? (
                                                <p className="w-[140px] px-2 pt-1 text-sm">
                                                    {item?.fileName.length > 15
                                                        ? `${item?.fileName.slice(0, 10)}...${item?.fileName
                                                              .split('.')
                                                              .pop()}`
                                                        : item?.fileName}
                                                </p>
                                            ) : null}
                                        </div>

                                        {viewMode ? (
                                            <>
                                                {isOpenHover && isOpenFileSeq === item?.fileSeq && (
                                                    <div
                                                        className="remove-button absolute right-2 top-2"
                                                        onClick={() => handleRemove(item?.fileSeq)}
                                                    >
                                                        <Icon
                                                            name="delete_outlined"
                                                            className="h-3.5 w-3.5 cursor-pointer fill-white"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p
                                                onClick={() => setSeqs(item?.fileSeq)}
                                                className="absolute right-2 top-2 cursor-pointer"
                                            >
                                                <Icon name="download" />
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {fileSeq?.map((item, index) => {
                                return (
                                    <div
                                        className="mt-2 flex w-full justify-between gap-3 bg-[#F4F4F4] p-2"
                                        key={index}
                                    >
                                        <div className="flex gap-2">
                                            {checkFileFormat(item?.fileName) === 'txt' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_text_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {checkFileFormat(item?.fileName) === 'docx' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_word_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {checkFileFormat(item?.fileName) === 'pptx' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_powerpoint_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {checkFileFormat(item?.fileName) === 'zip' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_archive_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {checkFileFormat(item?.fileName) === 'rar' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_archive_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {(checkFileFormat(item?.fileName) === 'xlsx' ||
                                                checkFileFormat(item?.fileName) === 'xls' ||
                                                checkFileFormat(item?.fileName) === 'csv') && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_excel_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            {checkFileFormat(item?.fileName) === 'pdf' && (
                                                <div className="info-report relative flex items-center gap-2">
                                                    <img
                                                        className="w-[16px]"
                                                        src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_3_pdf_x16.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            <p className="w-[170px] truncate text-sm">{item?.fileName}</p>
                                        </div>

                                        {viewMode ? (
                                            <div className="remove-button" onClick={() => handleRemove(item?.fileSeq)}>
                                                <Icon
                                                    name="close_circle"
                                                    className="h-3.5 w-3.5 cursor-pointer text-state-error"
                                                />
                                            </div>
                                        ) : (
                                            <p onClick={() => setSeqs(item?.fileSeq)} className="cursor-pointer">
                                                <Icon name="download" />
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                    {viewMode && (
                        <div className="mt-2  gap-2">
                            <Dropzone onDrop={handleDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className="relative flex h-[110px] w-full cursor-pointer items-center justify-center border border-dashed "
                                    >
                                        <input {...getInputProps()} />
                                        <div className="text-center">
                                            <Icon name="upload" />
                                            <p className="text-sm font-normal text-[#787878]">
                                                Choose files (.xlsx , .ppt, .pptx, .txt, .csv, .docx , .doc, .pdf, .png,
                                                .jpg, .jpeg, .zip, .rar)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                        </div>
                    )}
                </div>
            </div>
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                style={customStyles}
                chooseOut={true}
            >
                <div className=" relative">
                    <div className="absolute right-2 top-2 cursor-pointer" onClick={() => handleClose()}>
                        <Icon name="close" />
                    </div>
                    <img
                        // eslint-disable-next-line no-undef
                        src={`${process.env.REACT_APP_SERVICE_IMAGE}/${imgPreview}`}
                        onError={(e) => {
                            e.target.src = NoImage;
                            setErrorIndices((prevState) => ({
                                ...prevState,
                                // eslint-disable-next-line no-undef
                                [item?.fileSeq]: true
                            }));
                        }}
                        className="max-h-[800px] max-w-[1200px] border object-cover"
                    />
                </div>
            </ModalComponent>
        </div>
    );
};

export default MultipleFiles;
