import { useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { GET_USER_AVATAR } from 'apis/attachFile/attachFile';
import { memo, useEffect, useState } from 'react';
import NoImage from '../../assets/images/noImage.jpg';

const UserAvatar = ({ seq, entity, className, keyProp }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const { data: dataAvatarUser } = useQuery(GET_USER_AVATAR, {
        client: clientFile,
        variables: { groupId: `${entity}-${seq}` },
        skip: seq ? false : true
    });

    const defaultImageUrl = NoImage;

    const handleImageError = () => {
        if (currentImageUrl !== defaultImageUrl) {
            setCurrentImageUrl(defaultImageUrl);
        }
    };

    useEffect(() => {
        if (dataAvatarUser) {
            setCurrentImageUrl(dataAvatarUser?.getUserAvatar);
        }
    }, [dataAvatarUser, seq]);

    return (
        <div>
            <img
                src={currentImageUrl || defaultImageUrl}
                onError={handleImageError}
                className={`lazy ${className}`}
                loading="lazy"
                key={keyProp}
            />
        </div>
    );
};

export default memo(UserAvatar);
