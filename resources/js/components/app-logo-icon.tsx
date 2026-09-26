import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            aria-hidden="true"
            {...props}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M7 10V8a5 5 0 0 1 10 0v2h-2V8a3 3 0 0 0-6 0v2H7Z" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.5 10H17.5A2.5 2.5 0 0 1 20 12.5V17.5A2.5 2.5 0 0 1 17.5 20H6.5A2.5 2.5 0 0 1 4 17.5V12.5A2.5 2.5 0 0 1 6.5 10ZM10.7 14A1.3 1.3 0 1 0 13.3 14A1.3 1.3 0 1 0 10.7 14ZM11 14H13V17H11Z"
            />
        </svg>
    );
}
