import React from "react";
import { usePaginate } from '@/hooks/usePaginatation';
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Pagination(props) {
    const {
      onPageChange,
      totalCount,
      siblingCount = 1,
      currentPage,
      pageSize
    } = props;

    const paginationRange = usePaginate({
       currentPage,
       totalCount,
       siblingCount,
       pageSize
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const getItemProps = (index) => ({
      variant: currentPage === index ? "filled" : "text",
      color: currentPage === index ? "blue" : "blue-gray",
      onClick: () => onPageChange(index)
    });

    const next = () => {
        onPageChange(currentPage + 1);
    };
    
    const prev = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    return (
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
            onClick={prev}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            {
                paginationRange.map(pageNumber => {
                
                    // If the pageItem is a DOT, render the DOTS unicode character
                    // if (pageNumber === DOTS) {
                    //     return <IconButton>&#8230;</IconButton>;
                    // }
                    
                    // Render our Page Pills
                    return (
                        <IconButton 
                            {...getItemProps(pageNumber)} 
                        >
                            {pageNumber}
                        </IconButton>
                    );
                })
            }
          </div>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
            onClick={next}
            disabled={currentPage === lastPage}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
    );
}