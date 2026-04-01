import React from 'react';

interface DescriptionBlogProps {
    description?: string;
}

const DescriptionBlog: React.FC<DescriptionBlogProps> = ({ description }) => {
    return (
        <p className="m-4 text-base md:text-lg whitespace-pre-line">
            {description}
        </p>
    );
};

export default DescriptionBlog;
