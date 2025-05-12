import Icon from '../../icons/Icon';

const Pagination = ({ setCurrentPage, currentPage, pagination, itemNumber }) => {
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination?.totalItems / itemNumber);

    let pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return (
      <div className="flex justify-between items-center">
        <ul className="flex justify-center gap-2 text-xs font-medium">
          {/* Previous nhiều */}
          <li>
            <button
              className="bg-neu-500 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#0C66E4] rtl:rotate-180"
              onClick={() => handlePageChange(Math.max(1, currentPage - 5))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronRightDouble" className="rotate-180" />
            </button>
          </li>
          {/* Previous */}
          <li>
            <button
              className="bg-neu-500 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#0C66E4] rtl:rotate-180"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" className="rotate-180" />
            </button>
          </li>

          {/* Page Numbers */}
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
                    ? `block h-7 w-7 bg-[#0C66E4] text-center text-white leading-8 rounded-lg`
                    : `block h-7 w-7 bg-[#F2F2F2] text-center text-[#072546] leading-8 rounded-lg hover:bg-[#ACD1E8]`
                }
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              className="bg-neu-500 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#0C66E4] rtl:rotate-180"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronLeft" className="fill-[#072546]" />
            </button>
          </li>
          {/* Next nhiều */}
          <li>
            <button
              className="bg-neu-500 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#0C66E4] rtl:rotate-180"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 5))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRightDouble" className="" />
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return <div>{renderPagination()}</div>;
};

export default Pagination;
