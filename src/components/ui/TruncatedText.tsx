import { memo, useCallback, useRef, useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

// Component that shows tooltip only when text is truncated
export const TruncatedText = memo(
  ({ text, className }: { text: string; className?: string }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const checkTruncation = useCallback(() => {
      if (textRef.current) {
        setIsTruncated(
          textRef.current.scrollWidth > textRef.current.clientWidth
        );
      }
    }, []);

    if (isTruncated) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              ref={textRef}
              className={className}
              onMouseEnter={checkTruncation}
            >
              {text}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className='max-w-xs wrap-break-word'>{text}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <p
        ref={textRef}
        className={`${className} cursor-pointer`}
        onMouseEnter={checkTruncation}
      >
        {text}
      </p>
    );
  }
);
TruncatedText.displayName = 'TruncatedText';
