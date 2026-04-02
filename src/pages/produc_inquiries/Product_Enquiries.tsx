import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Container/Table/Table";
import type { Column } from "../../components/Container/Table/Table";
import ConfirmDeleteModal from "../../components/Container/CommonDeleteModel/CommonDeleteModel";

import {
  getInquiries,
  deleteInquiry,
  clearInquiryState,
} from "../../store/slice/inquirySlice";

interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: boolean;
}

const Product_Enquiries = () => {
  const dispatch = useDispatch();

  const { inquiries, loading, deleteSuccess, deleteError } = useSelector(
    (state: any) => state.inquiry || {},
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    dispatch(getInquiries() as any);
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      setDeleteModalOpen(false);
      setSelectedRow(null);
      dispatch(getInquiries() as any);
      dispatch(clearInquiryState());
    }

    if (deleteError) {
      setDeleteModalOpen(false);
      dispatch(clearInquiryState());
    }
  }, [deleteSuccess, deleteError]);

  const columns: Column<InquiryData>[] = [
    {
      key: "name",
      header: "NAME",
      width: "150px",
      sortable: true,
      align: "left",
      type: "text",
    },
    {
      key: "email",
      header: "EMAIL",
      width: "200px",
      type: "text",
    },
    {
      key: "phone",
      header: "PHONE",
      width: "140px",
      type: "text",
    },
    {
      key: "message",
      header: "MESSAGE",
      width: "250px",
      type: "text",
    },
    {
      key: "createdAt",
      header: "DATE",
      width: "150px",
      sortable: true,
      type: "text",
    },
    {
      key: "status",
      header: "STATUS",
      width: "120px",
      align: "center",
      type: "toggle",
      toggleConfig: {
        activeValue: true,
        inactiveValue: false,
        activeLabel: "Resolved",
        inactiveLabel: "Pending",
      },
    },
    {
      key: "actions",
      header: "ACTIONS",
      width: "120px",
      align: "center",
      type: "action",
      actionConfig: {
        showEdit: false,
        showDelete: true,
        onDelete: (row: any) => {
          setSelectedRow(row);
          setDeleteModalOpen(true);
        },
      },
    },
  ];

  const handleConfirmDelete = () => {
    if (selectedRow?.id) {
      dispatch(deleteInquiry(selectedRow.id) as any);
    }
  };

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={
          inquiries?.length
            ? inquiries.map((item: any) => ({
                id: item?._id,
                name: item?.name,
                email: item?.email,
                phone: item?.phone,
                message: item?.message,
                createdAt: new Date(item?.createdAt).toLocaleDateString(),
                status: item?.status === "resolved",
              }))
            : []
        }
        showAddButton={false}
        isLoading={loading}
        defaultRowsPerPage={10}
        rowsPerPageOptions={[10, 20, 50]}
        showPagination={true}
        showSearch={true}
        emptyMessage="No inquiries found"
        loadingMessage="Loading inquiries..."
        tableHeight="600px"
        initialSortColumn="createdAt"
        initialSortDirection="desc"
        enableDragScroll={true}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="Are you sure you want to delete this inquiry?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={loading}
      />
    </div>
  );
};

export default Product_Enquiries;
