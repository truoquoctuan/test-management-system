import Icon from 'components/icons/icons';

const Pagination = ({ setCurrentPage, currentPage, pagination, itemNumber }) => {
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handlePageChangeByOffset = (offset) => {
        const totalPages = Math.ceil(pagination?.totalElements / itemNumber);
        let newPage = currentPage + offset;
        newPage = Math.max(0, Math.min(newPage, totalPages - 1));
        setCurrentPage(newPage);
    };
    const renderPagination = () => {
        const totalPages = Math.ceil(pagination?.totalElements / itemNumber);
        let pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pageNumbers = [0, 1, 2, 3, 4, '...', totalPages - 1];
            } else if (currentPage >= totalPages - 3) {
                pageNumbers = [0, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
            } else {
                pageNumbers = [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
            }
        }
        return (
            <ol className="flex justify-center gap-2 text-xs font-medium">
                {currentPage > 0 ? (
                    <>
                        <li>
                            <button
                                className={`bg-neu-500 inline-flex h-7 w-7 items-center justify-center border hover:bg-[#D9D9D9] rtl:rotate-180`}
                                onClick={() => handlePageChangeByOffset(-5)}
                            >
                                <span className="sr-only">Back 5 Pages</span>
                                <Icon name="arow_to_back_2" />
                            </button>
                        </li>
                        <li>
                            <button
                                className={`bg-neu-500 inline-flex h-7 w-7 items-center justify-center border hover:bg-[#D9D9D9] rtl:rotate-180`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <span className="sr-only">Prev Page</span>
                                <Icon name="arow_to_back" />
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <button
                                className="bg-neu-500 inline-flex h-7 w-7  items-center justify-center border text-gray-400"
                                disabled
                            >
                                <span className="sr-only">First Page</span>
                                <Icon name="arow_to_back_disble" />
                            </button>
                        </li>
                        <li>
                            <button
                                className="bg-neu-500 inline-flex h-7 w-7  items-center justify-center border text-gray-400"
                                disabled
                            >
                                <span className="sr-only">First Page</span>
                                <Icon name="arow_to_back_2_disble" />
                            </button>
                        </li>
                    </>
                )}
                {/* Nút số trang */}
                {pageNumbers.map((page, index) => (
                    <li key={index}>
                        <button
                            onClick={() => {
                                if (page !== '...') {
                                    handlePageChange(page);
                                }
                            }}
                            disabled={currentPage === page || page === '...'}
                            className={
                                currentPage === page
                                    ? `block h-7 w-7 bg-[#0066CC] text-center leading-8 text-white`
                                    : `block h-7 w-7 bg-[#F2F2F2] text-center leading-8 text-gray-900 hover:bg-[#D9D9D9]`
                            }
                        >
                            {page !== '...' ? page + 1 : '...'}
                        </button>
                    </li>
                ))}

                {currentPage < totalPages - 1 ? (
                    <>
                        <li>
                            <button
                                className={`bg-neu-500 inline-flex h-7 w-7 items-center justify-center border hover:bg-[#D9D9D9] rtl:rotate-180`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <span className="sr-only">Next Page</span>
                                <Icon name="arow_to_next" />
                            </button>
                        </li>
                        <li>
                            <button
                                className={`bg-neu-500 inline-flex h-7 w-7 items-center justify-center border hover:bg-[#D9D9D9] rtl:rotate-180`}
                                onClick={() => handlePageChangeByOffset(5)}
                            >
                                <span className="sr-only">Next 5 Pages</span>
                                <Icon name="arow_to_next_2" />
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <button
                                className="bg-neu-500 inline-flex h-7 w-7  items-center justify-center border text-gray-400"
                                disabled
                            >
                                <span className="sr-only">Last Page</span>
                                <Icon name="arow_to_next_disble" />
                            </button>
                        </li>
                        <li>
                            <button
                                className="bg-neu-500 inline-flex h-7 w-7  items-center justify-center border text-gray-400"
                                disabled
                            >
                                <span className="sr-only">Last Page</span>
                                <Icon name="arow_to_next_2_disble" />
                            </button>
                        </li>
                    </>
                )}
            </ol>
        );
    };
    return <div>{renderPagination()}</div>;
};
export default Pagination;
