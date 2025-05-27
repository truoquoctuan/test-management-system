import Quill from 'quill';

const Inline = Quill.import('blots/inline');

class UserTagBlot extends Inline {
    static create(value) {
        let node = super.create();
        node.setAttribute('style', `color: ${value.color}; font-weight: ${value.fontWeight};`);
        node.setAttribute('data-id', value.userID);
        node.textContent = value.textContent;
        return node;
    }

    static formats(node) {
        return {
            color: node.style.color,
            fontWeight: node.style.fontWeight,
            userID: node.getAttribute('data-id')
        };
    }
}

UserTagBlot.blotName = 'userTag';
UserTagBlot.tagName = 'span';
Quill.register(UserTagBlot);

export default UserTagBlot;
