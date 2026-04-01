import { useState } from "react";
import Table from "../../components/Container/Table/Table";

interface OrderData {
    id: number;
    orderStatus: string;
    totalPrice: number;
    paymentStatus: string;
    customerName: string;
    orderDate: string;
    isActive: boolean;
}

const columns = [
    { 
        key: 'orderDate', 
        header: 'DATE', 
        width: '120px',
        sortable: true,
        align: 'left' as const,
        type: 'text' as const
    },
    { 
        key: 'id', 
        header: 'ORDER ID', 
        width: '100px',
        sortable: true,
        align: 'left' as const,
        type: 'text' as const
    },
    { 
        key: 'customerName', 
        header: 'CUSTOMER', 
        width: '150px',
        sortable: true,
        align: 'left' as const,
        type: 'text' as const
    },
    { 
        key: 'orderStatus', 
        header: 'ORDER STATUS', 
        width: '130px',
        sortable: true,
        align: 'left' as const,
        type: 'status' as const,
        editable: true,
        statusConfig: {
            editable: true,
            values: {
                'new': { 
                    label: 'New', 
                    color: '#3B82F6', 
                    bgColor: '#DBEAFE',
                    dotColor: '#3B82F6'
                },
                'pending': { 
                    label: 'Pending', 
                    color: '#F59E0B', 
                    bgColor: '#FEF3C7',
                    dotColor: '#F59E0B'
                },
                'processing': { 
                    label: 'Processing', 
                    color: '#8B5CF6', 
                    bgColor: '#EDE9FE',
                    dotColor: '#8B5CF6'
                },
                'shipped': { 
                    label: 'Shipped', 
                    color: '#06AED4', 
                    bgColor: '#CFFAFE',
                    dotColor: '#06AED4'
                },
                'delivered': { 
                    label: 'Delivered', 
                    color: '#10B981', 
                    bgColor: '#D1FAE5',
                    dotColor: '#10B981'
                },
                'completed': { 
                    label: 'Completed', 
                    color: '#059669', 
                    bgColor: '#A7F3D0',
                    dotColor: '#059669'
                },
                'cancelled': { 
                    label: 'Cancelled', 
                    color: '#EF4444', 
                    bgColor: '#FEE2E2',
                    dotColor: '#EF4444'
                }
            }
        }
    },
    { 
        key: 'totalPrice', 
        header: 'TOTAL PRICE', 
        width: '120px',
        sortable: true,
        align: 'right' as const,
        type: 'text' as const,
        editable: true,
        accessor: (row: OrderData) => `$${row.totalPrice.toFixed(2)}`
    },
    { 
        key: 'paymentStatus', 
        header: 'PAYMENT STATUS', 
        width: '140px',
        sortable: true,
        align: 'center' as const,
        type: 'payment' as const,
        editable: true,
        paymentConfig: {
            editable: true,
            values: {
                'paid': { 
                    label: 'Paid', 
                    color: '#10B981', 
                    bgColor: '#D1FAE5'
                },
                'unpaid': { 
                    label: 'Unpaid', 
                    color: '#EF4444', 
                    bgColor: '#FEE2E2'
                },
                'pending': { 
                    label: 'Pending', 
                    color: '#F59E0B', 
                    bgColor: '#FEF3C7'
                }
            }
        }
    },
    { 
        key: 'isActive', 
        header: 'STATUS', 
        width: '100px',
        align: 'center' as const,
        type: 'toggle' as const,
        toggleConfig: {
            activeValue: true,
            inactiveValue: false,
            activeLabel: 'Active',
            inactiveLabel: 'Inactive',
            onToggle: (row: OrderData, newValue: boolean) => {
                console.log(`Order ${row.id} status changed to:`, newValue);
                // Update your data here
            }
        }
    }
];

// Sample data matching the image
const orderData: OrderData[] = [
    { id: 1, orderDate: '2025-01-29', customerName: 'John Doe', orderStatus: 'New', totalPrice: 296, paymentStatus: 'Unpaid', isActive: true },
    { id: 2, orderDate: '2025-01-29', customerName: 'Sarah Johnson', orderStatus: 'New', totalPrice: 210.4, paymentStatus: 'Unpaid', isActive: true },
    { id: 3, orderDate: '2025-01-29', customerName: 'Michael Chen', orderStatus: 'Pending', totalPrice: 316, paymentStatus: 'Unpaid', isActive: true },
    { id: 4, orderDate: '2025-01-29', customerName: 'Emily Wilson', orderStatus: 'Processing', totalPrice: 0, paymentStatus: 'Unpaid', isActive: true },
    { id: 5, orderDate: '2025-01-29', customerName: 'David Brown', orderStatus: 'Shipped', totalPrice: 620.8, paymentStatus: 'Paid', isActive: true },
    { id: 6, orderDate: '2025-01-29', customerName: 'Olivia Davis', orderStatus: 'Delivered', totalPrice: 1235.4, paymentStatus: 'Unpaid', isActive: true },
    { id: 7, orderDate: '2025-01-29', customerName: 'William Lee', orderStatus: 'Completed', totalPrice: 0, paymentStatus: 'Paid', isActive: true },
    { id: 8, orderDate: '2025-01-29', customerName: 'Sophia Martinez', orderStatus: 'Cancelled', totalPrice: 1172.9, paymentStatus: 'Unpaid', isActive: true },
    { id: 9, orderDate: '2025-01-29', customerName: 'James Taylor', orderStatus: 'Cancelled', totalPrice: 1172.9, paymentStatus: 'Unpaid', isActive: true },
    { id: 10, orderDate: '2025-01-29', customerName: 'ET29-Rak', orderStatus: 'New', totalPrice: 729, paymentStatus: 'Unpaid', isActive: true },
    ...Array.from({ length: 90 }, (_, i) => ({
        id: 11 + i,
        orderDate: '2025-01-29',
        customerName: `Customer ${i + 11}`,
        orderStatus: ['New', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'][i % 7],
        totalPrice: Math.round(Math.random() * 1500 * 10) / 10,
        paymentStatus: Math.random() > 0.5 ? 'Paid' : 'Unpaid',
        isActive: Math.random() > 0.3
    }))
];

const Orders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<OrderData[]>(orderData);

    const handleStatusEdit = (row: OrderData, column: string, newValue: string) => {
        console.log(`Editing ${column} for order ${row.id}:`, newValue);
        
        // Update the data
        const updatedData = data.map(item => {
            if (item.id === row.id) {
                return { ...item, [column]: newValue };
            }
            return item;
        });
        
        setData(updatedData);
    };

    return (
        <div className="p-6">
            <Table
                columns={columns}
                data={data}
                isLoading={isLoading}
                onStatusEdit={handleStatusEdit}
                defaultRowsPerPage={20}
                rowsPerPageOptions={[10, 20, 50, 100]}
                showPagination={true}
                showSearch={true}
                emptyMessage="No orders found"
                loadingMessage="Loading orders..."
                tableHeight="600px"
                initialSortColumn="orderDate"
                initialSortDirection="desc"
                enableDragScroll={true}
            />
        </div>
    );
};

export default Orders;