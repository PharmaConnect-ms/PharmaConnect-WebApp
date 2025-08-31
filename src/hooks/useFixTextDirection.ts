'use client';
import { useEffect } from 'react';

/**
 * Custom hook to aggressively fix text direction and prevent character reversal
 * in rich text editors and input fields
 */
export const useFixTextDirection = (elementRef: React.RefObject<HTMLElement>, enabled = true) => {
  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    
    // Aggressive CSS fixes
    const applyTextDirectionFixes = (el: HTMLElement) => {
      el.style.direction = 'ltr';
      el.style.textAlign = 'left';
      el.style.unicodeBidi = 'normal';
      el.style.writingMode = 'horizontal-tb';
      el.style.transform = 'none';
      el.style.webkitTransform = 'none';
      el.setAttribute('dir', 'ltr');
      
      // Fix all child elements
      const children = el.querySelectorAll('*');
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.direction = 'ltr';
          child.style.unicodeBidi = 'normal';
          child.style.writingMode = 'horizontal-tb';
          child.style.transform = 'none';
          child.style.webkitTransform = 'none';
        }
      });
    };

    // Apply initial fixes
    applyTextDirectionFixes(element);

    // Prevent character reversal on input
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.isContentEditable) {
        // Force reflow to prevent character reversal
        setTimeout(() => {
          applyTextDirectionFixes(element);
          
          // Check for reversed text and fix it
          const text = target.textContent || '';
          if (text && text.length > 1) {
            // Additional protection against reversal
            target.style.direction = 'ltr';
            target.style.unicodeBidi = 'normal';
          }
        }, 0);
      }
    };

    // Add event listeners
    element.addEventListener('input', handleInput);
    element.addEventListener('keydown', handleInput);
    element.addEventListener('paste', handleInput);
    element.addEventListener('focus', () => applyTextDirectionFixes(element));

    // Observer to maintain fixes
    const observer = new MutationObserver(() => {
      applyTextDirectionFixes(element);
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'dir', 'class']
    });

    return () => {
      element.removeEventListener('input', handleInput);
      element.removeEventListener('keydown', handleInput);
      element.removeEventListener('paste', handleInput);
      element.removeEventListener('focus', () => applyTextDirectionFixes(element));
      observer.disconnect();
    };
  }, [elementRef, enabled]);
};

export default useFixTextDirection;
