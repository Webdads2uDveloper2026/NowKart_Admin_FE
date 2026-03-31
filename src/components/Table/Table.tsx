import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Edit,
    Eye,
    GripHorizontal,
    Loader2,
    MoreHorizontal,
    Search,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


// Define types for Redux state
interface DarkModeState {
  isDarkMode: boolean;
}

interface RootState {
  darkMode: DarkModeState;
}

// Define types for column configuration
interface Column<T = any> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'status' | 'payment' | 'action' | 'toggle';
  editable?: boolean;
  onEdit?: (row: T, newValue: any) => void;
  statusConfig?: {
    values: Record<string, { label: string; color: string; bgColor: string; dotColor?: string }>;
    editable?: boolean;
  };
  paymentConfig?: {
    values: Record<string, { label: string; color: string; bgColor: string }>;
    editable?: boolean;
  };
  actionConfig?: {
    showEdit?: boolean;
    showView?: boolean;
    showDelete?: boolean;
    showMore?: boolean;
    onEdit?: (row: T) => void;
    onView?: (row: T) => void;
    onDelete?: (row: T) => void;
    onMore?: (row: T) => void;
  };
  toggleConfig?: {
    activeValue?: any;
    inactiveValue?: any;
    activeLabel?: string;
    inactiveLabel?: string;
    activeColor?: string;
    inactiveColor?: string;
    onToggle?: (row: T, newValue: any) => void;
  };
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  showPagination?: boolean;
  showSearch?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
  tableHeight?: string;
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
  showDateFilter?: boolean;
  enableDragScroll?: boolean;
  showAddButton?: boolean;    
  onAddClick?: () => void;
  onStatusEdit?: (row: T, column: string, newValue: string) => void;
}

// Animation variants
const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  hover: { 
    backgroundColor: "rgba(234, 88, 12, 0.08)",
    transition: { duration: 0.2 }
  }
};

const cellVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const loadingVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const Table = <T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  onRowsPerPageChange,
  defaultRowsPerPage = 20,
  rowsPerPageOptions = [10, 20, 50, 100],
  showPagination = true,
  showSearch = true,
  emptyMessage = "No data available",
  loadingMessage = "Loading data...",
  className = "",
  tableHeight = "500px",
  initialSortColumn,
  initialSortDirection = 'asc',
  showAddButton = false,
  onAddClick,
  enableDragScroll = true,
  
  onStatusEdit
}: TableProps<T>) => {
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [showRowsPerPageDropdown, setShowRowsPerPageDropdown] = useState(false);
  
  // State for drag scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // State for edit modal
  const [editingCell, setEditingCell] = useState<{
    row: T;
    rowIndex: number;
    column: Column<T>;
    value: any;
  } | null>(null);

  // State for selected value in modal
  const [selectedValue, setSelectedValue] = useState<string>('');
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRowsPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setEditingCell(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditingCell(null);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Process data with search and sorting
  const processedData = (() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(row => {
        return columns.some(column => {
          const value = row[column.key]?.toString().toLowerCase() || '';
          return value.includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = aVal?.toString() || '';
        const bStr = bVal?.toString() || '';
        
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  })();

  // Pagination calculations
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const paginatedData = processedData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm, rowsPerPage]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableDragScroll || !scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (!enableDragScroll) return;
    
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    if (!enableDragScroll) return;
    
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableDragScroll || !isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle sort
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setShowRowsPerPageDropdown(false);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(value);
    }
  };

  // Handle cell click for editing
  const handleCellClick = (e: React.MouseEvent, row: T, rowIndex: number, column: Column<T>, value: any) => {
    e.stopPropagation();
    
    // Check if cell is editable
    const isEditable = 
      (column.type === 'status' && column.statusConfig?.editable) ||
      (column.type === 'payment' && column.paymentConfig?.editable) ||
      column.editable;
    
    if (isEditable) {
      setEditingCell({ row, rowIndex, column, value });
      setSelectedValue(value?.toString() || '');
    }
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { row, column } = editingCell;
    
    // Call the appropriate edit handler
    if (column.onEdit) {
      column.onEdit(row, selectedValue);
    } else if (onStatusEdit) {
      onStatusEdit(row, column.key, selectedValue);
    }

    // Update the data (this should be handled by parent component)
    // For now, we'll just close the modal
    setEditingCell(null);
  };

  // Handle toggle
  const handleToggle = (row: T, column: Column<T>, currentValue: any) => {
    if (!column.toggleConfig) return;
    
    const { activeValue, inactiveValue, onToggle } = column.toggleConfig;
    const newValue = currentValue === activeValue ? inactiveValue : activeValue;
    
    if (onToggle) {
      onToggle(row, newValue);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Render cell based on column type
  const renderCell = (row: T, column: Column<T>, rowIndex: number) => {
    const value = row[column.key];
    const isEditable = 
      (column.type === 'status' && column.statusConfig?.editable) ||
      (column.type === 'payment' && column.paymentConfig?.editable) ||
      column.editable;

    // Toggle column type
    if (column.type === 'toggle' && column.toggleConfig) {
      const { 
        activeValue = true, 
        inactiveValue = false,
        activeLabel = 'Active',
        inactiveLabel = 'Inactive'
      } = column.toggleConfig;
      
      const isActive = value === activeValue;
      
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle(row, column, value);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            isActive 
              ? 'bg-orange-600'
              : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
          <span className="sr-only">
            {isActive ? activeLabel : inactiveLabel}
          </span>
        </button>
      );
    }

    // Status column type (for Order Status, etc.)
    if (column.type === 'status' && column.statusConfig) {
      const status = value?.toString().toLowerCase() || '';
      const config = column.statusConfig.values[status] || column.statusConfig.values['default'] || {
        label: value?.toString() || '-',
        color: isDarkMode ? '#9CA3AF' : '#6B7280',
        bgColor: isDarkMode ? '#374151' : '#F3F4F6'
      };

      return (
        <div 
          className={`flex items-center ${isEditable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={(e) => handleCellClick(e, row, rowIndex, column, value)}
        >
          {config.dotColor && (
            <span 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: config.dotColor }}
            />
          )}
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              color: config.color,
              backgroundColor: config.bgColor
            }}
          >
            {config.label}
          </span>
          {isEditable && (
            <Edit className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
          )}
        </div>
      );
    }

    // Payment status column type
    if (column.type === 'payment' && column.paymentConfig) {
      const status = value?.toString().toLowerCase() || '';
      const config = column.paymentConfig.values[status] || column.paymentConfig.values['default'] || {
        label: value?.toString() || '-',
        color: isDarkMode ? '#9CA3AF' : '#6B7280',
        bgColor: isDarkMode ? '#374151' : '#F3F4F6'
      };

      return (
        <div 
          className={`flex items-center ${isEditable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={(e) => handleCellClick(e, row, rowIndex, column, value)}
        >
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              color: config.color,
              backgroundColor: config.bgColor
            }}
          >
            {config.label}
          </span>
          {isEditable && (
            <Edit className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
          )}
        </div>
      );
    }

    // Action buttons column type
    if (column.type === 'action' && column.actionConfig) {
      const { showEdit, showView, showDelete, showMore, onEdit, onView, onDelete, onMore } = column.actionConfig;
      
      return (
        <div className="flex items-center space-x-2">
          {showView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(row);
              }}
              className={`p-1.5 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {showEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(row);
              }}
              className={`p-1.5 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-orange-400' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-orange-600'
              }`}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {showDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row);
              }}
              className={`p-1.5 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {showMore && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMore?.(row);
              }}
              className={`p-1.5 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    // Default text column
    if (column.accessor) {
      return column.accessor(row);
    }

    return (
      <div 
        className={`flex items-center ${isEditable ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={(e) => handleCellClick(e, row, rowIndex, column, value)}
      >
        <span>{value?.toString() || '-'}</span>
        {isEditable && (
          <Edit className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
        )}
      </div>
    );
  };

  // Dynamic classes based on dark mode
  const tableContainerClasses = `rounded-lg border ${
    isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  } overflow-hidden ${className}`;

  const tableWrapperClasses = `overflow-auto ${
    enableDragScroll ? 'cursor-grab active:cursor-grabbing select-none' : ''
  }`;

  const headerClasses = `border-b ${
    isDarkMode 
      ? 'border-gray-700 bg-gray-900' 
      : 'border-gray-200 bg-gray-50'
  } sticky top-0 z-10`;

  const headerCellClasses = `px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
    isDarkMode ? 'text-gray-400' : 'text-gray-500'
  }`;

  const sortableHeaderClasses = `cursor-pointer hover:${
    isDarkMode ? 'text-orange-400' : 'text-orange-600'
  } transition-colors`;

  const rowClasses = `border-b transition-colors group ${
    isDarkMode 
      ? 'border-gray-700 hover:bg-gray-700/50' 
      : 'border-gray-100 hover:bg-orange-50'
  } ${onRowClick ? 'cursor-pointer' : ''}`;

  const cellClasses = `px-4 py-3 whitespace-nowrap text-sm ${
    isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  const searchInputClasses = `pl-10 pr-4 py-2 rounded-lg border transition-all w-64 ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
  } focus:outline-none`;

  // Modal classes
  const modalOverlayClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`;
  
  const modalClasses = `rounded-lg shadow-xl w-96 max-w-full ${
    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
  }`;

  const modalHeaderClasses = `flex items-center justify-between p-4 border-b ${
    isDarkMode ? 'border-gray-700' : 'border-gray-200'
  }`;

  const modalBodyClasses = `p-4`;

  const modalFooterClasses = `flex items-center justify-end space-x-2 p-4 border-t ${
    isDarkMode ? 'border-gray-700' : 'border-gray-200'
  }`;

  const modalButtonClasses = `px-4 py-2 rounded text-sm font-medium transition-colors ${
    isDarkMode
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

  const modalSaveButtonClasses = `px-4 py-2 rounded text-sm font-medium transition-colors ${
    isDarkMode
      ? 'bg-orange-600 text-white hover:bg-orange-700'
      : 'bg-orange-600 text-white hover:bg-orange-700'
  }`;

  // Pagination classes
  const paginationContainerClasses = `flex items-center justify-between px-4 py-3 ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`;

  const pageInfoClasses = `text-sm ${
    isDarkMode ? 'text-gray-400' : 'text-gray-600'
  }`;

  const paginationButtonClasses = `p-1 rounded transition-colors ${
    isDarkMode
      ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700 disabled:text-gray-600 disabled:hover:bg-transparent'
      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 disabled:text-gray-400 disabled:hover:bg-transparent'
  } disabled:cursor-not-allowed`;

  const pageNumberClasses = (isActive: boolean) => `
    min-w-[32px] h-8 flex items-center justify-center rounded text-sm transition-colors
    ${isActive 
      ? 'bg-orange-600 text-white'
      : isDarkMode
        ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700'
        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
    }
  `;

  const rowsPerPageButtonClasses = `flex items-center space-x-1 px-3 py-1.5 rounded text-sm border ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
  } transition-colors`;

  const rowsPerPageDropdownClasses = `absolute bottom-full mb-1 left-0 min-w-[120px] rounded-lg border shadow-lg overflow-hidden ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200'
  } z-20`;

  const rowsPerPageOptionClasses = (isSelected: boolean) => `
    px-4 py-2 text-sm cursor-pointer transition-colors
    ${isSelected
      ? 'bg-orange-600 text-white'
      : isDarkMode
        ? 'text-gray-300 hover:bg-gray-700'
        : 'text-gray-700 hover:bg-orange-50'
    }
  `;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="space-y-4"
    >
      {/* Table Header with Search */}
      <div className="flex items-center justify-between">
        {showSearch && (
          <motion.div 
            variants={cellVariants}
            className="relative"
          >
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={searchInputClasses}
            />
          </motion.div>
        )}
         
        
        
        {enableDragScroll && (
          <motion.div 
            variants={cellVariants}
            className={`flex items-center space-x-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {/* <button>Add</button> */}
            {showAddButton && (
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-orange-600 cursor-pointer text-white rounded-lg text-sm hover:bg-orange-700 transition"
      >
        + Add
      </button>
    )}
            <GripHorizontal className="w-4 h-4" />
            <span>Drag to scroll horizontally</span>
          </motion.div>
        )}
      </div>

      {/* Table Container with Fixed Height and Drag Scroll */}
      <div className={tableContainerClasses}>
        <div 
          ref={scrollContainerRef}
          style={{ height: tableHeight }} 
          className={tableWrapperClasses}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className="w-full border-collapse">
            {/* Table Head - Sticky */}
            <thead className={headerClasses}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${headerCellClasses} ${
                      column.sortable ? sortableHeaderClasses : ''
                    }`}
                    style={{ 
                      width: column.width,
                      textAlign: column.align || 'left'
                    }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <motion.div
                      variants={cellVariants}
                      className="flex items-center space-x-1"
                    >
                      <span>{column.header}</span>
                      
                      {/* Sort Icons */}
                      {column.sortable && (
                        <span className="inline-flex flex-col ml-1">
                          <ChevronUp className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'asc'
                              ? 'text-orange-600'
                              : isDarkMode ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                          <ChevronDown className={`w-3 h-3 -mt-1 ${
                            sortColumn === column.key && sortDirection === 'desc'
                              ? 'text-orange-600'
                              : isDarkMode ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        </span>
                      )}
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {/* Loading State */}
              {isLoading && (
                <motion.tr variants={rowVariants}>
                  <td colSpan={columns.length} className="px-4 py-12">
                    <motion.div
                      variants={loadingVariants}
                      animate="animate"
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <Loader2 className={`w-8 h-8 text-orange-600`} />
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {loadingMessage}
                      </p>
                    </motion.div>
                  </td>
                </motion.tr>
              )}

              {/* Empty State */}
              {!isLoading && paginatedData.length === 0 && (
                <motion.tr variants={rowVariants}>
                  <td colSpan={columns.length} className="px-4 py-12">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {emptyMessage}
                      </p>
                    </motion.div>
                  </td>
                </motion.tr>
              )}

              {/* Data Rows */}
              <AnimatePresence>
                {!isLoading && paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={onRowClick ? "hover" : undefined}
                    className={rowClasses}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <motion.td
                        key={`${rowIndex}-${column.key}`}
                        variants={cellVariants}
                        className={cellClasses}
                        style={{ textAlign: column.align || 'left' }}
                      >
                        {renderCell(row, column, rowIndex)}
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && totalItems > 0 && (
          <motion.div
            variants={cellVariants}
            className={paginationContainerClasses}
          >
            {/* Left side - Showing X - Y of Z */}
            <div className={pageInfoClasses}>
              {startIndex + 1} – {endIndex} of {totalItems}
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center space-x-4">
              {/* Page navigation */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={paginationButtonClasses}
                >
                  <span className="sr-only">First page</span>
                  <span aria-hidden="true">«</span>
                </button>

                {/* Previous page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={paginationButtonClasses}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    disabled={page === '...'}
                    className={pageNumberClasses(page === currentPage)}
                  >
                    {page}
                  </button>
                ))}

                {/* Next page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={paginationButtonClasses}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={paginationButtonClasses}
                >
                  <span className="sr-only">Last page</span>
                  <span aria-hidden="true">»</span>
                </button>
              </div>

              {/* Rows per page dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowRowsPerPageDropdown(!showRowsPerPageDropdown)}
                  className={rowsPerPageButtonClasses}
                >
                  <span>{rowsPerPage} per page</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    showRowsPerPageDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {showRowsPerPageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={rowsPerPageDropdownClasses}
                    >
                      {rowsPerPageOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleRowsPerPageChange(option)}
                          className={rowsPerPageOptionClasses(option === rowsPerPage)}
                        >
                          {option} per page
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlayClasses}
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={modalClasses}
            >
              <div className={modalHeaderClasses}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Edit {editingCell.column.header}
                </h3>
                <button
                  onClick={() => setEditingCell(null)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={modalBodyClasses}>
                {editingCell.column.type === 'status' && editingCell.column.statusConfig ? (
                  <div className="space-y-3">
                    {Object.entries(editingCell.column.statusConfig.values).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedValue(key)}
                        className={`w-full flex items-center p-3 rounded transition-colors ${
                          selectedValue === key
                            ? isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
                            : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        {config.dotColor && (
                          <span 
                            className="w-2 h-2 rounded-full mr-3" 
                            style={{ backgroundColor: config.dotColor }}
                          />
                        )}
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            color: config.color,
                            backgroundColor: config.bgColor
                          }}
                        >
                          {config.label}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : editingCell.column.type === 'payment' && editingCell.column.paymentConfig ? (
                  <div className="space-y-3">
                    {Object.entries(editingCell.column.paymentConfig.values).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedValue(key)}
                        className={`w-full flex items-center p-3 rounded transition-colors ${
                          selectedValue === key
                            ? isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
                            : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            color: config.color,
                            backgroundColor: config.bgColor
                          }}
                        >
                          {config.label}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                    placeholder={`Enter ${editingCell.column.header}`}
                  />
                )}
              </div>

              <div className={modalFooterClasses}>
                <button
                  onClick={() => setEditingCell(null)}
                  className={modalButtonClasses}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className={modalSaveButtonClasses}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Table;