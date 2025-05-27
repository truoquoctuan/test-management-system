import { toast } from 'sonner';

export const NotifyMe = (data) => {
    // Sử dụng regex để loại bỏ thẻ HTML
    const textContent = data.content.replace(/<\/?[^>]+(>|$)/g, '');
    if (!window.Notification) {
        console.log('Browser does not support notifications!');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            const notify = new Notification('Receive new notifications', {
                title: data?.content,
                body: textContent,
                data: {
                    status: 'open'
                },
                // eslint-disable-next-line no-undef
                icon: process.env.PUBLIC_URL + '/apple-touch-icon.png',
                requireInteraction: true,
                silent: true
            });

            notify.onclick = function () {
                // eslint-disable-next-line no-undef
                window.open(process.env.PUBLIC_URL, '_blank');
            };

            notify.onclose = function () {};
        } else {
            // request permission from user
            Notification.requestPermission()
                .then(function (p) {
                    // eslint-disable-next-line no-empty
                    if (p === 'granted') {
                    } else {
                        toast.success(
                            <p
                                id="notify-title-toast"
                                className={'notify-title'}
                                dangerouslySetInnerHTML={{
                                    __html: data?.content
                                }}
                            />,
                            {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 2000
                            }
                        );
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
    }
};
