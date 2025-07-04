import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import BookingIframe from './BookingIframe';
import { serviceCategories, type Service } from '../config/business';

const BookingView: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Klippningar');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  const handleBookingClick = (service: Service) => {
    setSelectedService(service);
  };

  const closeBookingIframe = () => {
    setSelectedService(null);
  };

  // Clean animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const serviceVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <>
      <motion.div 
        className="p-4 max-w-4xl mx-auto space-y-4 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Service Categories */}
        <div className="space-y-3">
          {serviceCategories.map((category, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-brand-accent transition-colors duration-300"
              variants={categoryVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Category Header */}
              <motion.button
                onClick={() => toggleCategory(category.title)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center mr-3"
                    whileHover={{ scale: 1.1, backgroundColor: "#d4af37" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Calendar size={18} className="text-brand-accent" />
                  </motion.div>
                  <div className="text-left">
                    <motion.h4 
                      className="text-base font-bold text-brand-primary"
                      whileHover={{ color: "#d4af37" }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.title}
                    </motion.h4>
                    <span className="text-xs text-gray-500">
                      {category.services.length} service{category.services.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedCategory === category.title ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedCategory === category.title ? (
                    <ChevronUp size={20} className="text-brand-accent" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </motion.div>
              </motion.button>

              {/* Services List */}
              <AnimatePresence>
                {expandedCategory === category.title && (
                  <motion.div 
                    className="border-t border-gray-100 bg-gray-50"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.05
                          }
                        }
                      }}
                    >
                      {category.services.map((service, serviceIndex) => (
                        <motion.div 
                          key={serviceIndex} 
                          className="p-4 border-b border-gray-200 last:border-b-0 bg-white mx-2 mb-2 last:mb-0 rounded-lg shadow-sm"
                          variants={serviceVariants}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-brand-primary text-sm leading-tight flex-1 mr-3">
                              {service.name}
                            </h5>
                            <div className="text-right flex-shrink-0">
                              <motion.div 
                                className="font-bold text-brand-accent text-sm"
                                whileHover={{ scale: 1.05 }}
                              >
                                {service.price}
                              </motion.div>
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-xs text-gray-600 mb-3">{service.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                              <Clock size={12} className="mr-1" />
                              <span className="text-xs">{service.duration}</span>
                            </div>
                            <motion.button 
                              onClick={() => handleBookingClick(service)}
                              className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-secondary transition-colors duration-200 shadow-md border border-brand-accent"
                              whileHover={{ 
                                scale: 1.05,
                                backgroundColor: "#d4af37",
                                color: "#1a1a1a"
                              }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              BOKA
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Booking Iframe Modal */}
      <AnimatePresence>
        {selectedService && (
          <BookingIframe
            bookingUrl={selectedService.bookingUrl}
            serviceName={selectedService.name}
            onClose={closeBookingIframe}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingView;