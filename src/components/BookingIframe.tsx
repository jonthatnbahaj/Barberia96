import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Phone, Wifi, WifiOff, Shield, ExternalLink } from 'lucide-react';
import { businessConfig } from '../config/business';

interface BookingIframeProps {
  bookingUrl: string;
  serviceName: string;
  onClose: () => void;
}

const BookingIframe: React.FC<BookingIframeProps> = ({ bookingUrl, serviceName, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide navigation and header when iframe opens
  useEffect(() => {
    // Add class to body to trigger navigation hiding
    document.body.classList.add('iframe-modal-open');
    
    // Hide navigation elements with animation
    const navigation = document.querySelector('.bottom-navigation');
    const header = document.querySelector('.main-header');
    
    if (navigation) {
      navigation.classList.add('hidden-for-iframe');
    }
    if (header) {
      header.classList.add('hidden-for-iframe');
    }

    return () => {
      // Restore navigation when iframe closes
      document.body.classList.remove('iframe-modal-open');
      if (navigation) {
        navigation.classList.remove('hidden-for-iframe');
      }
      if (header) {
        header.classList.remove('hidden-for-iframe');
      }
    };
  }, []);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when iframe modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // iOS Safari specific: Prevent zoom on input focus
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // Set a timeout to detect if iframe fails to load
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading && loadAttempts < 3) {
        console.log(`Load attempt ${loadAttempts + 1} timed out, retrying...`);
        setLoadAttempts(prev => prev + 1);
        handleRetry();
      } else if (isLoading) {
        console.log('All load attempts failed');
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Calculate and set proper heights
    const updateHeights = () => {
      const vh = window.innerHeight;
      const availableHeight = vh; // Full screen now
      
      if (containerRef.current) {
        containerRef.current.style.height = `${availableHeight}px`;
        containerRef.current.style.maxHeight = `${availableHeight}px`;
      }
      
      if (iframeRef.current) {
        iframeRef.current.style.height = `${availableHeight}px`;
        iframeRef.current.style.minHeight = `${availableHeight}px`;
      }
    };

    // Initial height calculation
    updateHeights();

    // Update heights on resize
    const handleResize = () => {
      setTimeout(updateHeights, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
      
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isLoading, loadAttempts]);

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIsLoading(false);
    setHasError(false);
    setLoadAttempts(0);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Ensure iframe takes full available height after load
    if (iframeRef.current && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      iframeRef.current.style.height = `${containerHeight}px`;
      iframeRef.current.style.minHeight = `${containerHeight}px`;
    }
  };

  const handleIframeError = () => {
    console.log('Iframe failed to load');
    setIsLoading(false);
    setHasError(true);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  const handleFallbackBooking = () => {
    // Open in external browser
    try {
      const newWindow = window.open(
        bookingUrl, 
        '_blank', 
        'noopener,noreferrer,width=375,height=667,scrollbars=yes,resizable=yes'
      );
      
      setTimeout(() => {
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = bookingUrl;
        }
      }, 100);
    } catch (error) {
      window.location.href = bookingUrl;
    }
    onClose();
  };

  const handleRetry = () => {
    console.log('Retrying iframe load...');
    setIsLoading(true);
    setHasError(false);
    
    // Reload iframe with cache busting
    if (iframeRef.current) {
      const url = new URL(bookingUrl);
      url.searchParams.set('_t', Date.now().toString());
      url.searchParams.set('_retry', loadAttempts.toString());
      
      // Add additional parameters to help with loading
      url.searchParams.set('embedded', 'true');
      url.searchParams.set('mobile', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'true' : 'false');
      
      console.log('Loading URL:', url.toString());
      iframeRef.current.src = url.toString();
    }
  };

  // Prepare the booking URL with proper parameters
  const prepareBookingUrl = () => {
    try {
      const url = new URL(bookingUrl);
      
      // Add parameters to help with iframe loading
      url.searchParams.set('embedded', 'true');
      url.searchParams.set('iframe', 'true');
      url.searchParams.set('mobile', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'true' : 'false');
      url.searchParams.set('_t', Date.now().toString());
      
      console.log('Prepared booking URL:', url.toString());
      return url.toString();
    } catch (error) {
      console.error('Error preparing booking URL:', error);
      return bookingUrl;
    }
  };

  // Handle postMessage for dynamic height and communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from booking system domain
      try {
        const bookingDomain = new URL(bookingUrl).hostname;
        if (!event.origin.includes(bookingDomain)) return;
      } catch {
        return;
      }
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        console.log('Received message from iframe:', data);
        
        // Handle different message types
        if (data?.type === 'iframe_loaded') {
          console.log('Iframe reports it has loaded');
          setIsLoading(false);
          setHasError(false);
        }
        
        if (data?.type === 'iframe_error') {
          console.log('Iframe reports an error');
          setHasError(true);
          setIsLoading(false);
        }
        
        if (data?.type === 'booking_complete') {
          console.log('Booking completed successfully');
          // Could show success message or close iframe
        }
      } catch (error) {
        console.log('Error parsing postMessage:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bookingUrl]);

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="iframe-modal fixed inset-0 bg-black bg-opacity-90 flex flex-col"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ zIndex: 2147483647 }}
      >
        {/* Floating Header */}
        <motion.div 
          className="iframe-modal-header bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-2xl relative h-16 flex-shrink-0 border-b border-brand-accent"
          variants={headerVariants}
          style={{ zIndex: 2147483646 }}
        >
          <div className="flex items-center min-w-0 flex-1">
            <motion.img 
              src={businessConfig.logo} 
              alt="Logo" 
              className="w-8 h-8 mr-3 rounded-full bg-white p-1 flex-shrink-0"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="min-w-0 flex-1">
              <motion.h2 
                className="font-bold text-sm truncate"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Secure Booking
              </motion.h2>
              <motion.p 
                className="text-xs opacity-90 flex items-center truncate"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 0.9 }}
                transition={{ delay: 0.3 }}
              >
                <Shield size={12} className="mr-1 flex-shrink-0" />
                <span className="truncate">{serviceName}</span>
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
            {/* Online/Offline indicator */}
            <motion.div 
              className="flex items-center"
              animate={{
                scale: isOnline ? [1, 1.2, 1] : 1,
                opacity: isOnline ? [1, 0.7, 1] : 0.5
              }}
              transition={{
                duration: 2,
                repeat: isOnline ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isOnline ? (
                <Wifi size={16} className="text-green-300" />
              ) : (
                <WifiOff size={16} className="text-red-300" />
              )}
            </motion.div>

            {/* External link button */}
            <motion.button
              onClick={handleFallbackBooking}
              className="p-2 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              aria-label="Open in browser"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Open in browser"
            >
              <ExternalLink size={16} />
            </motion.button>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              aria-label="Close booking"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <X size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Full-Screen Content Area */}
        <motion.div 
          ref={containerRef}
          className="iframe-container flex-1 relative bg-white overflow-hidden"
          style={{ 
            height: 'calc(100vh - 64px)',
            maxHeight: 'calc(100vh - 64px)',
            minHeight: 'calc(100vh - 64px)',
            zIndex: 2147483645
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center px-4">
                  <motion.div 
                    className="w-12 h-12 border-b-2 border-gray-900 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.p 
                    className="text-gray-600 text-base font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Loading secure booking...
                  </motion.p>
                  <motion.p 
                    className="text-gray-400 text-sm mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Connecting to booking system
                  </motion.p>
                  {loadAttempts > 0 && (
                    <motion.p 
                      className="text-gray-500 text-xs mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Attempt {loadAttempts + 1} of 3
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Offline State */}
          <AnimatePresence>
            {!isOnline && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white z-20 p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <WifiOff size={48} className="text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    No Internet Connection
                  </h3>
                  <p className="text-gray-600 mb-6 text-base">
                    Check your internet connection and try again.
                  </p>
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleRetry}
                      className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                      disabled={!isOnline}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Try Again
                    </motion.button>
                    <div className="flex items-center justify-center text-gray-600">
                      <Phone size={18} className="mr-2" />
                      <span>Call: {businessConfig.phone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {hasError && isOnline && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white z-10 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Could Not Load Booking
                  </h3>
                  <p className="text-gray-600 mb-6 text-base">
                    The booking system is temporarily unavailable. You can try again or open it in your browser.
                  </p>
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleRetry}
                      className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Try Again
                    </motion.button>
                    <motion.button
                      onClick={handleFallbackBooking}
                      className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Open in Browser
                    </motion.button>
                    <div className="flex items-center justify-center text-gray-600">
                      <Phone size={18} className="mr-2" />
                      <span>Or call: {businessConfig.phone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full-Screen Iframe */}
          {isOnline && (
            <motion.iframe
              ref={iframeRef}
              src={prepareBookingUrl()}
              className="w-full border-0 bg-white block"
              style={{ 
                height: '100%',
                minHeight: '100%',
                maxHeight: '100%',
                zIndex: 2147483644,
                WebkitOverflowScrolling: 'touch',
                overflow: 'auto'
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads"
              scrolling="auto"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Secure booking - ${serviceName}`}
              loading="eager"
              allow="payment; geolocation; camera; microphone"
              referrerPolicy="strict-origin-when-cross-origin"
              aria-label={`Booking form for ${serviceName}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingIframe;