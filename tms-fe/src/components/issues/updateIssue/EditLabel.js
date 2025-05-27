import { useMutation } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { MODIFY_LABEL } from 'apis/issues/issues';
import { ColorChecker } from 'components/common/ColorChecker';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TagsEdit from '../EditLabelTag';

const EditLabel = ({ dataIssueById, issuesId, refetch }) => {
    const [tags, setTags] = useState([]);
    const { testPlanId } = useParams();
    const [loadingTag, setLoadingTag] = useState(false);
    const [modalSelectTestcase, setModalSelectTestcase] = useState(false);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    useEffect(() => {
        setTags(
            dataIssueById?.labelsList?.map((item) => ({
                labelId: item.labelId,
                labelName: item.labelName
            }))
        );
    }, [dataIssueById, modalSelectTestcase]);
    const closeModal = () => {
        setModalSelectTestcase(false);
    };

    const [editLabelIssue] = useMutation(MODIFY_LABEL, { client: clientRun });
    const handleModifylabel = async () => {
        const newdata = {
            issuesId: issuesId,
            labelIds: tags?.map((item) => item.labelId).join(',')
        };
        await editLabelIssue({
            variables: newdata
        });
        await refetch();
    };

    useEffect(() => {
        if (modalSelectTestcase == false) {
            setLoadingTag(true);
            setTimeout(() => {
                setLoadingTag(false);
            }, 1000);
        }
    }, [modalSelectTestcase]);

    return (
        <div>
            <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-2 ">
                <div className="flex justify-between ">
                    <div className="text-[14px] font-semibold">Tags</div>
                    {checkStatus === 1 && checkRoleTestPland !== 3 && (
                        <button
                            className="text-sm text-[#1D79ED]"
                            onClick={() => setModalSelectTestcase(!modalSelectTestcase)}
                        >
                            Edit
                        </button>
                    )}
                </div>
                {loadingTag ? (
                    <div className="loader h-7 w-7"></div>
                ) : (
                    <div className="flex flex-wrap gap-2  text-sm ">
                        {dataIssueById?.labelsList?.map((item, index) => (
                            <div
                                style={{ backgroundColor: item?.labelColor }}
                                className={`px-2 py-[1px] font-medium ${
                                    ColorChecker(item?.labelColor) == 'dark' ? 'text-white' : 'text-black'
                                }`}
                                key={index}
                            >
                                {item?.labelName}
                            </div>
                        ))}
                        {dataIssueById?.labelsList.length == 0 && <p className="text-[14px] text-[#484848]">None</p>}
                        {modalSelectTestcase && (
                            <div className={`relative w-full cursor-pointer border border-[#B3B3B3] `}>
                                {tags?.length > 0 ? (
                                    <p className="py-2 pl-2 text-sm font-normal">
                                        {(() => {
                                            const maxLength = 30;
                                            let displayTags = [];
                                            let currentLength = 0;

                                            for (let i = 0; i < tags.length; i++) {
                                                const tag = tags[i].labelName;
                                                if (currentLength + tag.length + (i > 0 ? 2 : 0) <= maxLength) {
                                                    displayTags.push(tag);
                                                    currentLength += tag.length + (i > 0 ? 2 : 0);
                                                } else {
                                                    break;
                                                }
                                            }
                                            const remainingTagsCount = tags.length - displayTags.length;
                                            return (
                                                displayTags.join(', ') +
                                                (remainingTagsCount > 0 ? `,+${remainingTagsCount} more` : '')
                                            );
                                        })()}
                                    </p>
                                ) : (
                                    <p className="py-2 pl-2 text-sm font-normal">Tags</p>
                                )}

                                <div className="absolute right-2 top-2">
                                    <Icon name="down" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {modalSelectTestcase && (
                    <TagsEdit
                        onClose={closeModal}
                        modalSelectTestcase={modalSelectTestcase}
                        setModalSelectTestcase={setModalSelectTestcase}
                        testPlanId={testPlanId}
                        tags={tags}
                        setTags={setTags}
                        keyEdit={true}
                        refetch={refetch}
                        handleModifylabel={handleModifylabel}
                    />
                )}
            </div>
        </div>
    );
};

export default EditLabel;
