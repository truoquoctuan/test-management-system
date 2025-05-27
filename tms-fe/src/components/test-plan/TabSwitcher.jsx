/**
 * TabSwitcher component to switch between two tabs.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.activeTab - The current active tab state.
 * @param {Function} props.setActiveTab - Function to set the active tab state.
 * @param {string} props.firstTabName - The name of the first tab.
 * @param {string} props.secondTabName - The name of the second tab.
 * @param {number} props.countFirstTab - The count of items in the first tab.
 * @param {number} props.countSecondTab - The count of items in the second tab.
 * @returns {JSX.Element} The rendered component.
 */
const TabSwitcher = (props) => {
    const {
        setCurrentPage,
        updateUrlParam,
        activeTab,
        setActiveTab,
        firstTabName = 'first',
        secondTabName = 'second',
        countFirstTab = 0,
        countSecondTab = 0
    } = props;

    /**
     * Handles the tab switch.
     *
     * @param {string} tabPos - The position of the tab to switch to.
     */
    const handTab = (tabPos) => {
        setActiveTab({ isHandle: true, tabPos: tabPos });
        updateUrlParam({ param: 'type', value: tabPos });
        setCurrentPage(0);
    };

    return (
        <div className="relative flex">
            <div
                className={`flex w-full cursor-pointer items-center justify-center gap-x-1 p-2 text-base  transition-all duration-500 ${
                    activeTab?.tabPos === firstTabName ? ' font-bold text-primary-1' : 'font-medium text-neutral-4'
                }`}
                onClick={() => handTab(firstTabName)}
            >
                <div className="min-w-36 text-center">
                    <span>{firstTabName}</span>
                    <span> ({countFirstTab ?? 0})</span>
                </div>
            </div>

            <div
                className={`flex w-full cursor-pointer items-center justify-center gap-x-1 p-2 text-base   transition-all duration-500 ${
                    activeTab?.tabPos === secondTabName ? ' font-bold text-primary-1' : 'font-medium text-neutral-4'
                }`}
                onClick={() => handTab(secondTabName)}
            >
                <div className="min-w-36 text-center">
                    <span>{secondTabName}</span>
                    <span> ({countSecondTab ?? 0})</span>
                </div>
            </div>

            <div
                className={`animate__animated animate__faster absolute top-[calc(100%-3px)] h-[3px] w-1/2 bg-primary-1 ${
                    activeTab?.isHandle && activeTab?.tabPos === firstTabName && 'animate__slideInRight left-0'
                } ${activeTab?.isHandle && activeTab?.tabPos === secondTabName && 'animate__slideInLeft right-0'}`}
            ></div>
        </div>
    );
};

export default TabSwitcher;
